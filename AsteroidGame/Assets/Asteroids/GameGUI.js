import System.Xml;
public var questionsList:XmlNodeList;
public var questionImage : Texture2D;
public var popupImage : boolean = false;
public var currentQuestion;
public var buttonHeight:int = 50;
public var buttonWidth:int = 100;
public var problem;
public var sWidth = Screen.width;
public var sHeight = Screen.height;
public var image;
function Awake(){
	loadQuestions();
	currentQuestion = 0;
	problem = getProblem() as XmlNode;
	Camera.main.GetComponent.<JSExample3>().currentProblem = problem;
	var image = problem.ChildNodes[7].InnerText;
	image = image.Substring(0, image.length-4);
	questionImage = Instantiate(Resources.Load(image));
}

function OnGUI() {
	GUI.contentColor = Color.white;
	GUILayout.BeginArea (Rect (0,0,Screen.width,Screen.height));
		GUILayout.BeginHorizontal();
			if(GUILayout.Button("Go Home", GUILayout.Height(buttonHeight),GUILayout.Width(buttonWidth))){
				Application.LoadLevel("Title");
			}
			GUILayout.BeginVertical();
				GUILayout.Label(problem.ChildNodes[0].InnerText);
				GUILayout.Label(problem.ChildNodes[1].InnerText + 
				" " + problem.ChildNodes[2].InnerText + 
				" " + problem.ChildNodes[3].InnerText + 
				" " + problem.ChildNodes[4].InnerText);
			GUILayout.EndVertical();
			if(GUILayout.Button(questionImage, GUILayout.Height(buttonHeight),GUILayout.Width(buttonWidth))){
				if(popupImage){popupImage = false;}
				else{popupImage = true;}
			}
		GUILayout.EndHorizontal();
	GUILayout.EndArea();
	
	if(popupImage){
		GUILayout.BeginArea (Rect (sWidth/3, sHeight/3, sWidth/2, sHeight/2));
		GUILayout.Label (questionImage);
		GUILayout.EndArea();
	}
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
	problem = getProblem() as XmlNode;
	Camera.main.GetComponent.<JSExample3>().currentProblem = problem;
	var image = problem.ChildNodes[7].InnerText;
	image = image.Substring(0, image.length-4);
	questionImage = Instantiate(Resources.Load(image));
}