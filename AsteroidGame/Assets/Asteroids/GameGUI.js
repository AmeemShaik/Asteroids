import System.Xml;
public var questionsList:XmlNodeList;
public var questionImage : Texture2D;
public var ammoImage : Texture2D;
public var popupImage : boolean = false;
public var currentQuestion;
public var buttonHeight:int = 50;
public var buttonWidth:int = 100;
public var problem;
public var sWidth = Screen.width;
public var sHeight = Screen.height;
public var question; public var image; 
public var answer1; public var answer1comment;
public var answer2; public var answer2comment;
public var answer3; public var answer3comment;
public var answer4; public var answer4comment;
public var correctAnswer; public var difficulty;
public var ammo;

function Awake(){
	currentQuestion = -1;
	loadQuestions();
	Camera.main.GetComponent.<JSExample3>().currentProblem = problem;
	
	if(image != null){
		var currentImage = image;
		currentImage = currentImage.Substring(0, currentImage.length-4);
		questionImage = Instantiate(Resources.Load(currentImage));
	}
	ammoImage = Instantiate(Resources.Load("shotBall"));
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
						//GUILayout.FlexibleSpace();
						GUILayout.Label("(C) " + answer2);
						//GUILayout.FlexibleSpace();
					GUILayout.EndVertical();
					GUILayout.BeginVertical();
						GUILayout.Label("(B) " + answer1);
						//GUILayout.FlexibleSpace();
						GUILayout.Label("(D) " + answer2);
						//GUILayout.FlexibleSpace();
					GUILayout.EndVertical();
				GUILayout.EndHorizontal();
				/*
				GUILayout.BeginHorizontal();
					GUILayout.Label("(C) " + answer3);
					GUILayout.FlexibleSpace();
					GUILayout.Label("(D) " + answer4);
					//GUILayout.FlexibleSpace();
				GUILayout.EndHorizontal();*/
			GUILayout.EndVertical();
			if(GUILayout.Button(questionImage, GUILayout.Height(buttonHeight),GUILayout.Width(buttonWidth))){
				if(popupImage){popupImage = false;}
				else{popupImage = true;}
			}
		GUILayout.EndHorizontal();
		GUILayout.BeginHorizontal(); //Second horizontal has ball ammo
			//GUILayout.FlexibleSpace(); //Space pushes ammo to right side of screen
			//GUILayout.BeginArea(Rect(0, 0, Screen.width, Screen.height));
			GUILayout.BeginVertical(); //Places ammo vertically on right side
				GUILayout.BeginVertical();
					//var ammo = 3;
					for(var i=0; i< ammo; i++){
						GUILayout.Label(ammoImage);
					}
				GUILayout.EndVertical();
				//Code for progress bar goes here
			GUILayout.EndVertical();
			//GUILayout.EndArea();
		GUILayout.EndHorizontal();
	GUILayout.EndArea();
	
	if(popupImage){
		GUILayout.BeginArea (Rect (sWidth/3, sHeight/3, sWidth/2, sHeight/2));
		GUILayout.Label (questionImage);
		GUILayout.EndArea();
	}
}

function loadQuestions(){
	var xmlFile:TextAsset = Resources.Load("QuestionsXML") as TextAsset;
	var xmlDoc = new XmlDocument();
	xmlDoc.LoadXml(xmlFile.text);
	questionsList = xmlDoc.GetElementsByTagName("question");
	nextQuestion();
}
function nextQuestion(){
	currentQuestion++;
	problem = questionsList[currentQuestion] as XmlNode;
	if(problem.HasChildNodes){
		var childNodes = problem.ChildNodes;
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
	
	Camera.main.GetComponent.<JSExample3>().currentProblem = problem;

	
	if(image != null){
		var currentImage = image;
		currentImage = currentImage.Substring(0, currentImage.length-4);
		questionImage = Instantiate(Resources.Load(currentImage));
	}
}