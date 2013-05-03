import System.Xml;
public var questionsList:XmlNodeList;
public var levelOne:Array;
public var levelTwo:Array;
public var levelThree:Array;
public var currentQuestionSet: Array; 
public var currentLevel;
public var questionCount;
public var style = new GUIStyle();
public var fontStyle = new GUIStyle();
public var smallerFontStyle = new GUIStyle();
public var smallestFontStyle = new GUIStyle();
public var buttonStyle = new GUIStyle();
public var interfaceStyle = new GUIStyle();
public var questionImage : Texture2D;
public var ammoImage : Texture2D;
public var progressBG : Texture2D; 
public var progressMG : Texture2D;
public var progressFG : Texture2D;
public var spacebg1 : Texture;
public var spacebg2 : Texture;
public var spacebg3 : Texture;
public var popupImage : boolean = false;
public var showComment : boolean = false;
public var startGame: boolean = true;
public var showCongrats: boolean = false;
public var message;
public var currentQuestion;
public var answeredQuestion : int;
public var buttonHeight:int = 75;
public var buttonWidth:int = 100;
public var problem;
public var progress : float;
public var sWidth : int;
public var sHeight : int;
public var question; public var image; public var id;
public var answer1; public var answer1comment;
public var answer2; public var answer2comment;
public var answer3; public var answer3comment;
public var answer4; public var answer4comment;
public var correctAnswer;
public var ammo;
public var answeredQuestionComment;
public var ammoEnd = false;
public var timeSpent = 0.0f;
var isWorkingOnQuestion = true;
public var playerName;
public var theRect;
public var space2:Texture2D;
public var font;
public var victory = false;
function Awake(){
	interfaceStyle.normal.background = MakeTex (1,3,Color.white);
	progress = 0;
	questionCount = -1;
	levelOne = new Array();
	levelTwo = new Array();
	levelThree = new Array();
	currentQuestionSet = levelOne;
	currentLevel = 1;
	currentQuestion = -1;
	loadQuestions();
	Camera.main.GetComponent.<Main>().currentProblem = problem;
	playerName = PlayerPrefs.GetString("playerName");
	
	if(image != null){
		var currentImage = image;
		currentImage = currentImage.Substring(0, currentImage.length-4);
		questionImage = Instantiate(Resources.Load(currentImage));
	}
	sHeight = Screen.height;
	sWidth = Screen.width;
	buttonHeight = (.123 * Screen.height);
	buttonWidth = (.12 * Screen.width);
	ammoImage = Instantiate(Resources.Load("missile"));
	progressBG = Instantiate(Resources.Load("progressBG"));
	progressMG = Instantiate(Resources.Load("progressMG"));
	progressFG = Instantiate(Resources.Load("progressFG"));
	spacebg1 = Instantiate(Resources.Load("space"));
	spacebg2 = Instantiate(Resources.Load("space2"));
	spacebg3 = Instantiate(Resources.Load("space3"));
	font = Resources.Load("Fonts/ContrailOne-Regular");
	progress = 0;
	style.normal.background = MakeTex(1, 1, Color.black);
  	style.normal.textColor = Color.white;
  	style.alignment = TextAnchor.MiddleCenter;
  	smallerFontStyle.normal.textColor = Color.white;
  	smallestFontStyle.normal.textColor = Color.white;
  	
}
function Update () {
	if (isWorkingOnQuestion)
		timeSpent += Time.deltaTime;
}
function OnGUI() {
	GUI.Box(Rect(.05 * Screen.width,.125*sHeight,Screen.width,8),"",style);
	GUI.Box(Rect(0,0,.05*Screen.width,Screen.height),"",style);
	GUI.Box(Rect(.05 * Screen.width,.135*sHeight,Screen.width,3),"",interfaceStyle);
	GUI.Box(Rect(.05 * Screen.width,.135*sHeight,3,sHeight),"",interfaceStyle);

	GUI.skin.font = font;
	GUI.contentColor = Color.white;
	GUILayout.BeginArea (Rect (0,0,Screen.width,Screen.height));
		GUILayout.BeginHorizontal();
			if(GUILayout.Button("Go Home", GUILayout.Height(buttonHeight),GUILayout.Width
(buttonWidth))){
				Application.LoadLevel("Title");
			}
			GUILayout.Space(5);
			GUILayout.BeginVertical();
				GUILayout.Space(5);
				GUILayout.Label(question, fontStyle);
				GUILayout.BeginHorizontal();
					GUILayout.BeginVertical();
						if(answer1.length() > 45){
							GUILayout.Label("(A) " + answer1, smallestFontStyle);
						}
						else if(answer1.length() > 35){
							GUILayout.Label("(A) " + answer1, smallerFontStyle);
						}
						else{GUILayout.Label("(A) " + answer1, fontStyle);}
						if(answer3.length() > 45){
							GUILayout.Label("(C) " + answer3, smallestFontStyle);
						}
						else if(answer3.length() > 35){
							GUILayout.Label("(C) " + answer3, smallerFontStyle);
						}
						else{GUILayout.Label("(C) " + answer3, fontStyle);}
					GUILayout.EndVertical();
					GUILayout.BeginVertical();
						if(answer2.length() > 45){
							GUILayout.Label("(B) " + answer2, smallestFontStyle);
						}
						else if(answer2.length() > 35){
							GUILayout.Label("(B) " + answer2, smallerFontStyle);
						}
						else{GUILayout.Label("(B) " + answer2, fontStyle);}
						if(answer4.length() > 45){
							GUILayout.Label("(D) " + answer4, smallestFontStyle);
						}
						else if(answer4.length() > 35){
							GUILayout.Label("(D) " + answer4, smallerFontStyle);
						}
						else{GUILayout.Label("(D) " + answer4, fontStyle);}
					GUILayout.EndVertical();
				GUILayout.EndHorizontal();
			GUILayout.EndVertical();
			if(GUILayout.Button(questionImage, GUILayout.Height(buttonHeight),GUILayout.Width
(buttonWidth))){
				if(popupImage){popupImage = false;}
				else{popupImage = true;}
			}
		GUILayout.EndHorizontal();		
		GUILayout.BeginHorizontal();
			GUILayout.BeginVertical();
				GUILayout.BeginVertical();
					GUILayout.Space(10);
					GUILayout.Label(" Warp", fontStyle);
					GUILayout.Label("Power", fontStyle);
				GUILayout.EndVertical();
				GUILayout.FlexibleSpace();
				theRect = GUILayoutUtility.GetLastRect();
				theRect.width = ammoImage.width;
				theRect.height = ammoImage.height*2.5;
				GUI.DrawTexture(new Rect(theRect.x+4, theRect.y, theRect.width, theRect.height
+theRect.height/8), progressBG);
				GUI.DrawTexture(new Rect(theRect.x+12, theRect.y+10, theRect.width*.5, 
theRect.height), progressMG);
				if(progress/8 <= 1){
					GUI.DrawTexture(new Rect(theRect.x+12, theRect.y+theRect.height+10-
(theRect.height*(progress/8)), theRect.width*.5, theRect.height*(progress/8)), progressFG);
				}
				else{progress = 0;}
				GUILayout.EndVertical();
		GUILayout.EndHorizontal();
		GUILayout.Space(20);
		GUILayout.BeginHorizontal(); //Second horizontal contains ammo
				GUILayout.BeginVertical();
					for(var i=0; i< ammo; i++){
						GUILayout.Label(ammoImage);
					}
				GUILayout.EndVertical();
		GUILayout.EndHorizontal();
	GUILayout.EndArea();

	if(popupImage){
		GUILayout.BeginArea (Rect (Screen.width/2-questionImage.width/2, Screen.height/2-
questionImage.height/2, questionImage.width, questionImage.height));
		GUILayout.Label (questionImage);
		GUILayout.EndArea();
	}
	if(startGame){
		GUILayout.BeginArea(Rect(0, Screen.height*.13, Screen.width, Screen.height));
 		if(GUILayout.Button("Welcome, space pilot! Get ready!\n", style, GUILayout.Height(Screen.height))){
	   		startGame = false;
		}
		GUILayout.EndArea();
	}
	if(showComment){
	  	//GUI.Box(Rect(0, Screen.height*.15, Screen.width, Screen.height*.85), answer1comment,style);
	  	GUILayout.BeginArea(Rect(0, Screen.height*.13, Screen.width, Screen.height));
	  	if(answeredQuestion == 0){
	  	  if(GUILayout.Button("Correct Answer!", style, GUILayout.Height(Screen.height))){
	  	  	isWorkingOnQuestion=true;
		  	showComment=false;
		  } 
		}
		else{
			if(answeredQuestionComment==null){
				answeredQuestionComment = "";
			}
		  	if(GUILayout.Button("Wrong Answer! \n" + answeredQuestionComment, style, GUILayout.Height
(Screen.height))){
		   		showComment=false;
			}
		}
		if(Camera.main.GetComponent.<Main>().ammo == 0){
			nextQuestion();
			Camera.main.GetComponent.<Main>().Initialize();

		}
		GUILayout.EndArea();
 	}
 	else if(ammoEnd&&ammo==0){
 		GUILayout.BeginArea(Rect(0, Screen.height*.13, Screen.width, Screen.height));
 		if(GUILayout.Button("No ammo left! \n", style, GUILayout.Height(Screen.height))){
	   		nextQuestion();
	   		Camera.main.GetComponent.<Main>().Initialize();
 			ammoEnd=false;
	
		}
		GUILayout.EndArea();
 	}
 	if(showCongrats){
		GUILayout.BeginArea(Rect(0, Screen.height*.13, Screen.width, Screen.height));
 		if(GUILayout.Button(message+"\n", style, GUILayout.Height(Screen.height))){
	   		showCongrats = false;
		}
		GUILayout.EndArea();
	}
	if(victory){
		GUILayout.BeginArea(Rect(0, Screen.height*.13, Screen.width, Screen.height));
 		if(GUILayout.Button("CONGRATS!! You've won!!\n", style, GUILayout.Height(Screen.height))){
	   		Application.LoadLevel("Title");
		}
		GUILayout.EndArea();
	}
}

function MakeTex(width: int, height: int, col: Color) {
    var pix = new Color[width * height];
   
    for (i = 0; i < pix.Length; i++) {
        pix[i] = col;
    }
   
    var result = new Texture2D(width, height);
    result.SetPixels(pix);
    result.Apply();
    return result;
}

function loadQuestions(){
	var level1xml = Resources.Load("GeneralL1Questions") as TextAsset;
	var level2xml = Resources.Load("GeneralL2Questions") as TextAsset;
	var level3xml = Resources.Load("GeneralL3Questions") as TextAsset;
	var xml1Doc = new XmlDocument();
	xml1Doc.LoadXml(level1xml.text);
	var xml2Doc = new XmlDocument();
	xml2Doc.LoadXml(level2xml.text);
	var xml3Doc = new XmlDocument();
	xml3Doc.LoadXml(level3xml.text);
	questionsList1 = xml1Doc.GetElementsByTagName("question");
	questionsList2 = xml2Doc.GetElementsByTagName("question");
	questionsList3 = xml3Doc.GetElementsByTagName("question");
	var childNodes;
	for(var i = 0; i < questionsList1.Count; i++){
		childNodes = questionsList1[i].ChildNodes;
		levelOne.Add(questionsList1[i]);
	}
	for(var j = 0; j < questionsList2.Count; j++){
		childNodes = questionsList2[j].ChildNodes;
		levelTwo.Add(questionsList2[j]);
	}
	for(var k = 0; k < questionsList3.Count; k++){
		childNodes = questionsList3[k].ChildNodes;
		levelThree.Add(questionsList3[k]);
	}
	randomizeArray(levelOne);
	randomizeArray(levelTwo);
	randomizeArray(levelThree);
	nextQuestion();
} 

function nextQuestion(){
	timeSpent = 0.0f;
	//isWorkingOnQuestion=true;
	questionCount++;
	if((progress == 8)||(questionCount == 10)){
		if(progress == 8){
			progress = 0;
			if(currentLevel!=3){
				currentLevel++;
				var space = GameObject.Find("space");
				switch(currentLevel)
				{
				case 1:
					currentQuestionSet = levelOne;
					GameObject.Find("space").guiTexture.texture = spacebg1;
					break;
				case 2:
					currentQuestionSet = levelTwo;
					GameObject.Find("space").guiTexture.texture = spacebg2;
					message = "Congrats! You've been promoted from Space Pilot to Flight Officer!";
					showCongrats = true;
					break;
				case 3:
					currentQuestionSet = levelThree;
					GameObject.Find("space").guiTexture.texture = spacebg3;
					message = "Congrats! You've been promoted from Flight Officer to Command Pilot!";
					showCongrats = true;
					break;
				}
				currentQuestion = -1;
			}
			else if(currentLevel == 3){
				victory = true;
			}
		}
		else{
			progress = 0;
		}
		questionCount = 0;
	}
	currentQuestion++;
	if(currentQuestion == currentQuestionSet.Count){
		currentQuestion = 0;
	}
	problem = currentQuestionSet[currentQuestion] as XmlNode;
	if(problem.HasChildNodes){
		var childNodes = problem.ChildNodes;
		answer1comment=null;answer2comment=null;answer3comment=null;answer4comment=null;
		for(var i=0; i<childNodes.Count; i++){
			switch(childNodes[i].Name)
			{
			case "id":
				id = problem.ChildNodes[i].InnerText;
				break;
			case "problem":
				question = problem.ChildNodes[i].InnerText;
				break;
			case "image":
				image = problem.ChildNodes[i].InnerText;
				break;
			case "answer1":
				answer1 = problem.ChildNodes[i].InnerText;
				answer1 = Regex.Replace(answer1,"\n"," ");
				break;
			case "answer1comment":
				answer1comment = problem.ChildNodes[i].InnerText;
				break;
			case "answer2":
				answer2 = problem.ChildNodes[i].InnerText;
				answer2 = Regex.Replace(answer2,"\n"," ");
				break;
			case "answer2comment":
				answer2comment = problem.ChildNodes[i].InnerText;
				break;
			case "answer3":
				answer3 = problem.ChildNodes[i].InnerText;
				answer3 = Regex.Replace(answer3,"\n"," ");
				break;
			case "answer3comment":
				answer3comment = problem.ChildNodes[i].InnerText;
				break;
			case "answer4":
				answer4 = problem.ChildNodes[i].InnerText;
				answer4 = Regex.Replace(answer4,"\n"," ");
				break;
			case "answer4comment":
				answer4comment = problem.ChildNodes[i].InnerText;
				break;
			case "correctAnswer":
				correctAnswer = problem.ChildNodes[i].InnerText;
				break;
			}
		}
	}
	
	Camera.main.GetComponent.<Main>().currentProblem = problem;

	
	if(image != null){
		var currentImage = image;
		currentImage = currentImage.Substring(0, currentImage.length-4);
		questionImage = Instantiate(Resources.Load(currentImage));
	}
}
function randomizeArray(arr : Array)
{
    for (var i = arr.length - 1; i > 0; i--) {
        var r = Random.Range(0,i);
        var tmp = arr[i];
        arr[i] = arr[r];
        arr[r] = tmp;
    }
}