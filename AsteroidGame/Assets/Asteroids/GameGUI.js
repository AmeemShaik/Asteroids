import System.Xml;
public var questionsList:XmlNodeList;
public var style = new GUIStyle();
public var questionImage : Texture2D;
public var ammoImage : Texture2D;
public var progressBG : Texture2D; public var progressFG : Texture2D;
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

function Awake(){
	currentQuestion = -1;
	loadQuestions();
	Camera.main.GetComponent.<JSExample3>().currentProblem = problem;
	
	if(image != null){
		var currentImage = image;
		currentImage = currentImage.Substring(0, currentImage.length-4);
		questionImage = Instantiate(Resources.Load(currentImage));
	}
	ammoImage = Instantiate(Resources.Load("missile"));
	progressBG = Instantiate(Resources.Load("progressBG"));
	progressFG = Instantiate(Resources.Load("progressFG"));
	progress = 0;
	style.normal.background = MakeTex(1, 1, Color.black);
  	style.normal.textColor = Color.white;
  	style.alignment = TextAnchor.MiddleCenter;

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
			if(GUILayout.Button(questionImage, GUILayout.Height(buttonHeight),GUILayout.Width(buttonWidth))){
				//if(popupImage){popupImage = false;}
				//else{popupImage = true;}
				progress++;
			}
		GUILayout.EndHorizontal();
		//GUILayout.Space(20);
		
		GUILayout.BeginHorizontal();
			GUILayout.BeginVertical();
			//GUILayout.Label("5/10");
				GUILayout.BeginVertical();
					GUILayout.Label("Warp");
					GUILayout.Label("Power");
				GUILayout.EndVertical();
				GUILayout.FlexibleSpace();
				var theRect = GUILayoutUtility.GetLastRect();
				theRect.width = ammoImage.width;
				theRect.height = ammoImage.height*3;
				//GUI.Box(theRect, progressBG);
				//GUI.DrawTexture(theRect, progressBG); //Replace questionImage with progressbar texture
				if(progress/10 <= 1){
					GUI.DrawTexture(new Rect(theRect.x+10, theRect.y+10, theRect.width*.75, theRect.height*(progress/10)), progressFG);
				}
				else{progress = 0;}
				GUILayout.EndVertical();
		GUILayout.EndHorizontal();
		
		//GUILayout.FlexibleSpace();
		GUILayout.Space(20);
		GUILayout.BeginHorizontal(); //Second horizontal has ball ammo
			//GUILayout.BeginVertical();
				GUILayout.BeginVertical();
					for(var i=0; i< ammo; i++){
						GUILayout.Label(ammoImage);
					}
				GUILayout.EndVertical();
				//GUILayout.FlexibleSpace();
		GUILayout.EndHorizontal();
	GUILayout.EndArea();
	
	if(popupImage){
		GUILayout.BeginArea (Rect (Screen.width/2-questionImage.width/2, Screen.height/2-questionImage.height/2, questionImage.width, questionImage.height));
		GUILayout.Label (questionImage);
		GUILayout.EndArea();
	}
	
	if(showComment){
	  	//GUI.Box(Rect(0, Screen.height*.15, Screen.width, Screen.height*.85), answer1comment,style);
	  	GUILayout.BeginArea(Rect(0, Screen.height*.15, Screen.width, Screen.height));
	  	if(answeredQuestion == 0){
	  	  if(GUILayout.Button("Correct Answer!", style, GUILayout.Height(Screen.height*.85))){
		  	showComment=false;
		  } 
		}
		else if(eval("answer"+answeredQuestion+"comment")!=null){
		  	if(GUILayout.Button("Wrong Answer! \n" + eval("answer"+answeredQuestion+"comment"), style, GUILayout.Height(Screen.height*.85))){
		   		showComment=false;
			}
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
	
	Camera.main.GetComponent.<JSExample3>().currentProblem = problem;

	
	if(image != null){
		var currentImage = image;
		currentImage = currentImage.Substring(0, currentImage.length-4);
		questionImage = Instantiate(Resources.Load(currentImage));
	}
}