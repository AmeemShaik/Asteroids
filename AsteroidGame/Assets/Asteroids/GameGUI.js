import System.Xml;
public var questionsList:XmlNodeList;
public var questionImage : Texture2D;
public var popupImage : boolean = false;
public var currentQuestion;
public var buttonHeight:int = 50;
public var buttonWidth:int = 100;
function Awake(){
	loadQuestions();
	currentQuestion = 0;
	var problem = getProblem() as XmlNode;
	Camera.main.GetComponent.<JSExample3>().currentProblem = problem;
}

function OnGUI() {
	GUI.contentColor = Color.white;
	var problem = getProblem() as XmlNode;
	Camera.main.GetComponent.<JSExample3>().currentProblem = problem;
	if(problem.HasChildNodes){
		var question = problem.ChildNodes[0].InnerText;
		var answer1 = problem.ChildNodes[1].InnerText;
		var answer2 = problem.ChildNodes[2].InnerText;
		var answer3 = problem.ChildNodes[3].InnerText;
		var answer4 = problem.ChildNodes[4].InnerText;
		var difficulty = problem.ChildNodes[5].InnerText;
		var correctAnswer = problem.ChildNodes[6].InnerText;
		var image = problem.ChildNodes[7].InnerText;
 	}
 	image = image.Substring(0, image.length-4);
	questionImage = Instantiate(Resources.Load(image));
	GUILayout.BeginArea (Rect (0,0,Screen.width,Screen.height));
		GUILayout.BeginHorizontal();
			if(GUILayout.Button("Go Home", GUILayout.Height(buttonHeight),GUILayout.Width(buttonWidth))){
				Application.LoadLevel("Title");
			}
			GUILayout.BeginVertical();
				GUILayout.Label(question);
				GUILayout.Label(answer1 + " " + answer2 + " " + answer3 + " " + answer4);
			GUILayout.EndVertical();
			if(GUILayout.Button(questionImage, GUILayout.Height(buttonHeight),GUILayout.Width(buttonWidth))){
				if(popupImage){popupImage = false;}
				else{popupImage = true;}
			}
		GUILayout.EndHorizontal();
	GUILayout.EndArea();
	
	if(popupImage){
		sWidth = Screen.width;
		sHeight = Screen.height;
		GUILayout.BeginArea (Rect (sWidth/3, sHeight/3, sWidth/2, sHeight/2));
			GUILayout.Label (questionImage);
		GUILayout.EndArea();
	}
	
/*
	GUI.contentColor = Color.white;
	questionImage = Instantiate(Resources.Load("drug_label"));
	miniPicSize = 65;
	picSize = 400;
	var problem = getProblem() as XmlNode;
	if(problem.HasChildNodes){
		var question = problem.ChildNodes[0].InnerText;
		var answer1 = problem.ChildNodes[1].InnerText;
		var answer2 = problem.ChildNodes[2].InnerText;
		var answer3 = problem.ChildNodes[3].InnerText;
		var answer4 = problem.ChildNodes[4].InnerText;
		var difficulty = problem.ChildNodes[5].InnerText;
		var correctAnswer = problem.ChildNodes[6].InnerText;
		var image = problem.ChildNodes[7].InnerText;
 	}

	if(GUILayout.Button("Go Home", GUILayout.Height(buttonHeight),GUILayout.Width(buttonWidth))){
				Application.LoadLevel("Title");
			}
	GUI.Label (Rect (Screen.width/2 - 150, 10, 300, 25), question);
	GUI.Label (Rect (Screen.width/2- 75, 30, 150, 30), answer1 + " " + answer2 + " " + answer3 + " " + answer4);
	if(GUI.Button (Rect (Screen.width - miniPicSize-5,5, miniPicSize, miniPicSize), questionImage)){
		if(popupImage){popupImage = false;}
		else{popupImage = true;}
	}
	GUI.Label (Rect (0, miniPicSize-5, Screen.width+10, 20), "__________________________________________________________________________________________________________________________________________________________________________________________________");

	//Toggles image popup
	if(popupImage){
		GUI.Label (Rect (Screen.width/2-125, Screen.height/2-125, picSize, picSize), questionImage);
	}
	*/
}

function getProblem(){
	return questionsList[currentQuestion];
}

function loadQuestions(){
	var xmlFile:TextAsset = Resources.Load("QuestionsXML") as TextAsset;
	var xmlDoc = new XmlDocument();
	xmlDoc.LoadXml(xmlFile.text);
	questionsList = xmlDoc.GetElementsByTagName("question");
}
function nextQuestion(){
	currentQuestion++;
	var problem = getProblem() as XmlNode;
	Camera.main.GetComponent.<JSExample3>().currentProblem = problem;
}