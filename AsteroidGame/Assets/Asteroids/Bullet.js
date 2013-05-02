// ------------------------------------------------------------------------
// Orthello 2D Framework Example 
// (C)opyright 2011 - WyrmTale Games - http://www.wyrmtale.com
// ------------------------------------------------------------------------
// More info http://www.wyrmtale.com/orthello
// ------------------------------------------------------------------------
// Because Orthello is created as a C# framework the C# classes 
// will only be available as you place them in the /Standard Assets folder.
//
// If you would like to test the JS examples or use the framework in combination
// with Javascript coding, you will have to move the /Orthello/Standard Assets folder
// to the / (root).
//
// This code was commented to prevent compiling errors when project is
// downloaded and imported using a package.
// ------------------------------------------------------------------------
// Bullet behaviour class
// ------------------------------------------------------------------------

private var sprite:OTSprite;                            // this bullet's sprite class
private var app:Main;                              // main application class

private var speed:int = 1000;                           // bullet speed
private var ignoreCollisions:Number = 0;                // ignore debree collisions time

private var debree:Array = new Array();                 // created debree list
private var alive = true;
private var leftBorder;
private var rightBorder;
private var topBorder;
private var bottomBorder;
private var ammo;
var playerName;
var doc;
var element;
var MainCamera;
// Use this for initialization
function Start () {
	doc = new XmlDocument();
	
	playerName = PlayerPrefs.GetString("playerName");
	if(System.IO.File.Exists(Application.dataPath + "/" + playerName + ".xml")){
		doc.Load(Application.dataPath + "/" + playerName + ".xml");
	}else{
		doc.LoadXml("<responded></responded>");
	}
    element = doc.CreateElement("question");
	//populateStatistics();

    // Get application main class
    app = Camera.main.GetComponent("Main");
    // Get this bullet's sprite class
    sprite = GetComponent("OTSprite");
	// Because Javascript does not support C# delegate we have to notify our sprite class that 
	// we want to receive notification callbacks.
	// If we have initialized for callbacks our (!IMPORTANT->) 'public' declared call back 
	// functions will be asutomaticly called when an event takes place.
	// HINT : This technique can be used within a C# class as well.
    sprite.InitCallBacks(this);
    var dist = (transform.position - Camera.main.transform.position).z;
    leftBorder = Camera.main.ViewportToWorldPoint(Vector3(0,0,dist)).x;
	rightBorder = Camera.main.ViewportToWorldPoint(Vector3(1,0,dist)).x;
	topBorder = Camera.main.ViewportToWorldPoint(Vector3(0,0,dist)).y;
	bottomBorder = Camera.main.ViewportToWorldPoint(Vector3(0,1,dist)).y;
	for(var c in Camera.allCameras){
		if(c.gameObject.name == "QuestionPanel"){
			MainCamera = Camera.main.GetComponent.<Main>();
			this.ammo = MainCamera.ammo;
		}
	}
}

// Update is called once per frame
function Update () {
	this.ammo = MainCamera.ammo;
    // Update bullet position
    sprite.position += sprite.yVector * speed * Time.deltaTime;
    // Destroy bullet as it moves out of view

	if((sprite.position.x<leftBorder || sprite.position.x > rightBorder || sprite.position.y<(topBorder) || sprite.position.y>bottomBorder)){
		if(ammo==0){
			storeStat();
			for(var c in Camera.allCameras){
				if(c.gameObject.name == "QuestionPanel"){
					c.GetComponent.<GameGUI>().ammoEnd = true;
				}
			}
		}
		Camera.main.GetComponent.<Main>().bulletExists = false;
		Destroy(sprite);
		Destroy(this);
	}
}

// OnCollision callback function  is called when this bullet collides with another 'collidable' object
// !IMPORTANT - This sprite's collidable setting has to be true otherwide
// collision delegates will not be called
public function OnCollision(owner:OTObject)
{   	        
	if(owner.collisionObject.name!="forceField"){
    // Lets Explode this asteroid
	var name = owner.collisionObject.name;
	var obj:GameObject = GameObject.Find(name);
	OT.DestroyObject(sprite);
    Destroy(obj.GetComponent.<Asteroid>().textObj);  
    app.Explode(owner.collisionObject, this, true);
    if(obj.GetComponent.<Asteroid>().isCorrect){
		for(var c in Camera.allCameras){
			if(c.gameObject.name == "QuestionPanel"){
				c.GetComponent.<GameGUI>().answeredQuestion = 0;
				c.GetComponent.<GameGUI>().showComment = true;
				c.GetComponent.<GameGUI>().isWorkingOnQuestion = false;
				c.GetComponent.<GameGUI>().progress++;							
				populateStats();
			}
		}
	//Populating correctly_answered element for statistics
	var innerEle = doc.CreateElement("correctly_answered");
	innerEle.InnerText = "yes";
	element.AppendChild(innerEle);
    nextQ();
  }
  else{
	if(obj.GetComponent.<Asteroid>().textObj != null){
	    var asteroidMesh = obj.GetComponent.<Asteroid>().textObj.GetComponent(TextMesh) as TextMesh;
	    var s = asteroidMesh.text as String;
	    var aQ : int;
	    switch(s)
	    {
	    case "A":
	     aQ = 1;
	     break;
	    case "B":
	     aQ = 2;
	     break;
	    case "C":
	     aQ = 3;
	     break;
	    case "D":
	     aQ = 4;
	     break;
	    }
	    for(var c in Camera.allCameras){
			if(c.gameObject.name == "QuestionPanel"){
					if(ammo==0)
						storeStat();
					c.GetComponent.<GameGUI>().answeredQuestion = aQ;
					switch(aQ){
						case 1:
							c.GetComponent.<GameGUI>().answeredQuestionComment = c.GetComponent.<GameGUI>().answer1comment;
							break;
						case 2:
							c.GetComponent.<GameGUI>().answeredQuestionComment = c.GetComponent.<GameGUI>().answer2comment;
							break;
						case 3:
							c.GetComponent.<GameGUI>().answeredQuestionComment = c.GetComponent.<GameGUI>().answer3comment;
							break;
						case 4:
							c.GetComponent.<GameGUI>().answeredQuestionComment = c.GetComponent.<GameGUI>().answer4comment;
							break;
						}
					c.GetComponent.<GameGUI>().showComment = true;
					}
				}
			}
	 else{
		if(ammo==0){
		
			for(var c in Camera.allCameras){
				if(c.gameObject.name == "QuestionPanel"){
					c.GetComponent.<GameGUI>().ammoEnd = true;
				}
			}
			storeStat();

		}
	  }
   	}
   	Camera.main.GetComponent.<Main>().bulletExists = false;
  }
}

function populateStats(){
	for(var c in Camera.allCameras){
		if(c.gameObject.name == "QuestionPanel"){
		
					//Populating question_number element for statistics
			
			var innerEle2 = doc.CreateElement("question_number");
			var currQuestion = c.GetComponent.<GameGUI>().currentQuestion;
			currQuestion++;
			innerEle2.InnerText = currQuestion + "";
			element.AppendChild(innerEle2);

		
			//Populating ammo_remaining element for statistics
			var innerEle3 = doc.CreateElement("ammo_remaining");
			var ammoStat = c.GetComponent.<GameGUI>().ammo;
			innerEle3.InnerText = ammoStat + "";
			element.AppendChild(innerEle3);
			
			//Populating time spent element for statistics
			var innerEle4 = doc.CreateElement("time_spent");
			var rounded = Mathf.Round(c.GetComponent.<GameGUI>().timeSpent * 10)/10;
			innerEle4.InnerText = rounded+"";
			element.AppendChild(innerEle4);
			
			//Populating difficulty element for statistics
			var innerEle5 = doc.CreateElement("difficulty");
			var difficultyLvl = c.GetComponent.<GameGUI>().difficulty + "";
			innerEle5.InnerText = difficultyLvl;
			element.AppendChild(innerEle5);
		}
	}
}

function storeStat(){
	populateStats();
	var innerEle2 = doc.CreateElement("correctly_answered");
	innerEle2.InnerText = "no";
	element.AppendChild(innerEle2);
	doc.GetElementsByTagName("responded")[0].AppendChild(element);
	doc.Save(Application.dataPath + "/" + playerName + ".xml");
    element = doc.CreateElement("question");
}

function nextQ(){
	//This function calls next question, so this is an appropriate 
	//time to create a new question node in statistics
	doc.GetElementsByTagName("responded")[0].AppendChild(element);
	doc.Save(Application.dataPath + "/" + playerName + ".xml");
    element = doc.CreateElement("question");
	
	//Question Logic: go to next question
	for(var c in Camera.allCameras){
		if(c.gameObject.name == "QuestionPanel"){

			
			c.GetComponent.<GameGUI>().nextQuestion();
		}
	}
	
	Camera.main.GetComponent.<Main>().Initialize();

}