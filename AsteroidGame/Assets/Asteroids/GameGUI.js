import System.Xml;
public var questionsList:XmlNodeList;
public var levelOne:Array;
public var levelTwo:Array;
public var levelThree:Array;
public var currentQuestionSet: Array;
public var currentLevel;
public var questionCount;
public var style = new GUIStyle();
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
public var currentQuestion;
public var answeredQuestion : int;
public var buttonHeight:int = 75;
public var buttonWidth:int = 100;
public var problem;
public var progress : float;
public var sWidth = Screen.width;
public var sHeight = Screen.height;
public var question; public var image; 
public var answer1; public var answer1comment;
public var answer2; public var answer2comment;
public var answer3; public var answer3comment;
public var answer4; public var answer4comment;
public var correctAnswer; public var difficulty;
public var ammo;
public var answeredQuestionComment;
public var ammoEnd = false;
public var timeSpent = 0.0f;
var isWorkingOnQuestion = true;
public var playerName;
public var theRect;
public var space2:Texture2D;

function Awake(){
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
	ammoImage = Instantiate(Resources.Load("missile"));
	progressBG = Instantiate(Resources.Load("progressBG"));
	progressMG = Instantiate(Resources.Load("progressMG"));
	progressFG = Instantiate(Resources.Load("progressFG"));
	spacebg1 = Instantiate(Resources.Load("space"));
	spacebg2 = Instantiate(Resources.Load("space2"));
	spacebg3 = Instantiate(Resources.Load("space3"));
	progress = 0;
	style.normal.background = MakeTex(1, 1, Color.black);
  	style.normal.textColor = Color.white;
  	style.alignment = TextAnchor.MiddleCenter;

}
function Update () {
	if (isWorkingOnQuestion)
		timeSpent += Time.deltaTime;
		
	//Debug.Log(isWorkingOnQuestion);
}
function OnGUI() {
	GUI.contentColor = Color.white;
	GUILayout.BeginArea (Rect (0,0,Screen.width,Screen.height));
		GUILayout.BeginHorizontal();
			if(GUILayout.Button("Go Home", GUILayout.Height(buttonHeight),GUILayout.Width(buttonWidth))){
				Application.LoadLevel("Title");
			}
			GUILayout.BeginVertical();
				GUILayout.Label(question);
				GUILayout.BeginHorizontal();
					GUILayout.BeginVertical();
						GUILayout.Label("(A) " + answer1);
						GUILayout.Label("(C) " + answer3);
					GUILayout.EndVertical();
					GUILayout.BeginVertical();
						GUILayout.Label("(B) " + answer2);
						GUILayout.Label("(D) " + answer4);
					GUILayout.EndVertical();
				GUILayout.EndHorizontal();
			GUILayout.EndVertical();
			if(GUILayout.Button(correctAnswer, GUILayout.Height(buttonHeight),GUILayout.Width(buttonWidth))){
				if(popupImage){popupImage = false;}
				else{popupImage = true;}
			}
		GUILayout.EndHorizontal();		
		GUILayout.BeginHorizontal();
			GUILayout.BeginVertical();
				GUILayout.BeginVertical();
					GUILayout.Label("Warp Power");
				GUILayout.EndVertical();
				GUILayout.FlexibleSpace();
				theRect = GUILayoutUtility.GetLastRect();
				theRect.width = ammoImage.width;
				theRect.height = ammoImage.height*2.5;
				GUI.DrawTexture(new Rect(theRect.x, theRect.y, theRect.width, theRect.height+theRect.height/8), progressBG);
				GUI.DrawTexture(new Rect(theRect.x+10, theRect.y+10, theRect.width*.5, theRect.height), progressMG);
				if(progress/8 <= 1){
					GUI.DrawTexture(new Rect(theRect.x+10, theRect.y+theRect.height+10-(theRect.height*(progress/8)), theRect.width*.5, theRect.height*(progress/8)), progressFG);
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
		GUILayout.BeginArea (Rect (Screen.width/2-questionImage.width/2, Screen.height/2-questionImage.height/2, questionImage.width, questionImage.height));
		GUILayout.Label (questionImage);
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
		  	if(GUILayout.Button("Wrong Answer! \n" + answeredQuestionComment, style, GUILayout.Height(Screen.height))){
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
 		GUILayout.BeginArea(Rect(0, Screen.height*.15, Screen.width, Screen.height));
 		if(GUILayout.Button("No ammo left! \n", style, GUILayout.Height(Screen.height))){
 			nextQuestion();
	   		Camera.main.GetComponent.<Main>().Initialize();
	   		ammoEnd=false;
	   		
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
	var xmlFile:TextAsset = Resources.Load("test") as TextAsset;
	var xmlDoc = new XmlDocument();
	xmlDoc.LoadXml(xmlFile.text);
	questionsList = xmlDoc.GetElementsByTagName("question");
	var childNodes;
	var index;
	for(var i = 0; i < questionsList.Count; i++){
		index = -1;
		childNodes = questionsList[i].ChildNodes;
		for(var j = 0; j < childNodes.Count; j++){
			if(childNodes[j].Name == "difficulty"){
				index = j;
				break;
			}
		}
		switch(childNodes[index].InnerText)
		{
		case "1":
			levelOne.Add(questionsList[i]);
			break;
		case "2":
			levelTwo.Add(questionsList[i]);
			break;
		case "3":
			levelThree.Add(questionsList[i]);
			break;
		}
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
					break;
				case 3:
					currentQuestionSet = levelThree;
					GameObject.Find("space").guiTexture.texture = spacebg3;
					break;
				}
				currentQuestion = -1;
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
			case "problem":
				question = problem.ChildNodes[i].InnerText;
				break;
			case "image":
				image = problem.ChildNodes[i].InnerText;
				break;
			case "answer1":
				answer1 = problem.ChildNodes[i].InnerText;
				break;
			case "answer1comment":
				answer1comment = problem.ChildNodes[i].InnerText;
				break;
			case "answer2":
				answer2 = problem.ChildNodes[i].InnerText;
				break;
			case "answer2comment":
				answer2comment = problem.ChildNodes[i].InnerText;
				break;
			case "answer3":
				answer3 = problem.ChildNodes[i].InnerText;
				break;
			case "answer3comment":
				answer3comment = problem.ChildNodes[i].InnerText;
				break;
			case "answer4":
				answer4 = problem.ChildNodes[i].InnerText;
				break;
			case "answer4comment":
				answer4comment = problem.ChildNodes[i].InnerText;
				break;
			case "correctAnswer":
				correctAnswer = problem.ChildNodes[i].InnerText;
				break;
			case "difficulty":
				difficulty = problem.ChildNodes[i].InnerText;
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