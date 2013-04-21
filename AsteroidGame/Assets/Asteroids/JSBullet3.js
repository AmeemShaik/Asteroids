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
private var app:JSExample3;                              // main application class

private var speed:int = 1000;                           // bullet speed
private var ignoreCollisions:Number = 0;                // ignore debree collisions time

private var debree:Array = new Array();                 // created debree list
private var alive = true;
private var leftBorder;
private var rightBorder;
private var topBorder;
private var bottomBorder;
private var ammo;
// Use this for initialization
function Start () {
    // Get application main class
    app = Camera.main.GetComponent("JSExample3");
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
			ammo = c.GetComponent.<GameGUI>().ammo;
		}
	}
}

// Update is called once per frame
function Update () {
    // Check if we have to ignore colliding with created debree
    if (ignoreCollisions > 0)
    {
        // increase ignore time
        ignoreCollisions -= Time.deltaTime;
        if (ignoreCollisions < 0) ignoreCollisions = 0;
    }
    else
    {
        // we no longer have to ignore the created debree so
        // lets clear the debree list.
        debree = new Array();
    }
    // Update bullet position
    sprite.position += sprite.yVector * speed * Time.deltaTime;
    // Destroy bullet as it moves out of view

	if(ammo==0&&(sprite.position.x<leftBorder || sprite.position.x > rightBorder || sprite.position.y<(topBorder) || sprite.position.y>bottomBorder)){
		for(var c in Camera.allCameras){
			if(c.gameObject.name == "QuestionPanel"){
				c.GetComponent.<GameGUI>().ammoEnd = true;
			}
		}
		Destroy(sprite);
		Destroy(this);
	}
}

// This method will add a debree object to the ignore debree list.
// We will have to maintain a ignore debree list because if we dont,
// this bullet can generate a 'recursive' exploding state that will
// create LOTS and LOTS of debree, totaly hanging this application
public function AddDebree(debreeObject:OTAnimatingSprite)
{
    debree.push(debreeObject);
}

// OnCollision callback function  is called when this bullet collides with another 'collidable' object
// !IMPORTANT - This sprite's collidable setting has to be true otherwide
// collision delegates will not be called
public function OnCollision(owner:OTObject)
{   	        
    // check if the asteroid we are colliding with is not in our
    // ignore debree list.		
	var found:boolean = false;
	for (var i:int = 0; i<debree.length; i++)
		if (debree[i] == owner.collisionObject)
		{
			found = true;
			break;
		}
	
    if (!found)
    {
        // We have to ignore debree the following 0.1 seconds
        ignoreCollisions = 0.1f;
        // Lets Explode this asteroid
		var name = owner.collisionObject.name;
		var obj:GameObject = GameObject.Find(name);
		OT.DestroyObject(sprite);
        Destroy(obj.GetComponent.<JSAsteroid3>().textObj);  
        app.Explode(owner.collisionObject, this, true);
        if(obj.GetComponent.<JSAsteroid3>().isCorrect){
		for(var c in Camera.allCameras){
			if(c.gameObject.name == "QuestionPanel"){
				c.GetComponent.<GameGUI>().answeredQuestion = 0;
				c.GetComponent.<GameGUI>().showComment = true;
			}
		}
        nextQ();
  }else{
	if(obj.GetComponent.<JSAsteroid3>().textObj != null){
	    var asteroidMesh = obj.GetComponent.<JSAsteroid3>().textObj.GetComponent(TextMesh) as TextMesh;
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
			Destroy(sprite);
			Destroy(this);	
		}
	  }
   }
  }
}

function nextQ(){
	for(var c in Camera.allCameras){
		if(c.gameObject.name == "QuestionPanel"){
			c.GetComponent.<GameGUI>().nextQuestion();
		}
	}
	Camera.main.GetComponent.<JSExample3>().Initialize();
}