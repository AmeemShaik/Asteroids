 //var cubeRenderer:Renderer;
import System.Text.RegularExpressions;
var buttonWidth:int = 200;
var buttonHeight:int = 25;
var spacing:int = 25;
var titleMenu : boolean = true;
var popupDifficulty : boolean = false;
var enterName : boolean = false;
var help : boolean = false;
var titleStyle = new GUIStyle();
var difficulty;
var img: Texture2D;
var cursorMode : CursorMode = CursorMode.Auto;
public var ammo;
public var playerName = "Default Cadet";
public var font;

function Awake(){
	font = Resources.Load("Fonts/ContrailOne-Regular");
	var v2 = Vector2(16,16);
	Cursor.SetCursor(img,v2,cursorMode);
}

function OnGUI() {
	GUI.skin.font = font;
	if(this.GetComponent("LevelUploader").uploading)
		GUI.enabled = false;
	if(titleMenu){
		GUILayout.BeginArea(Rect(Screen.width/2 - buttonWidth/2, Screen.height/2 - 200, buttonWidth, 500));
			GUILayout.Label("Space TAKERS", titleStyle);
			GUILayout.Space(spacing);
			if(GUILayout.Button("Start Game", GUILayout.Height(buttonHeight))){
				enterName = true;
				titleMenu = false;
			}
			GUILayout.Space(spacing);
			if(GUILayout.Button("How to Play", GUILayout.Height(buttonHeight))){
				help = true;
				titleMenu = false;
			}
			
			GUILayout.Space(spacing);
			if(GUILayout.Button("Exit", GUILayout.Height(buttonHeight))){
				Application.Quit();
			}
		GUILayout.EndArea();
	}
	
	if(popupDifficulty){
		var spacing = 50;
		GUILayout.BeginArea(Rect(Screen.width/2 - buttonWidth/2, Screen.height/2 - 200, buttonWidth, 400));
		if(GUILayout.Button("Easy", GUILayout.Height(buttonHeight))){
			difficulty = 1;
			ammo = 4;
			PlayerPrefs.SetInt("difficulty", difficulty);
			PlayerPrefs.SetInt("ammo", ammo);
			Application.LoadLevel("mainLevel");
		}
		GUILayout.Space(spacing);
		if(GUILayout.Button("Medium", GUILayout.Height(buttonHeight))){
			difficulty = 2;
			ammo = 3;
			PlayerPrefs.SetInt("difficulty", difficulty);
			PlayerPrefs.SetInt("ammo", ammo);
			Application.LoadLevel("mainLevel");
		}
		GUILayout.Space(spacing);
		if(GUILayout.Button("Hard", GUILayout.Height(buttonHeight))){
			ammo = 2;
			difficulty = 3;
			PlayerPrefs.SetInt("difficulty", difficulty);
			PlayerPrefs.SetInt("ammo", ammo);
			Application.LoadLevel("mainLevel");
		}
		GUILayout.Space(spacing);
		GUI.enabled = true;
		if(GUILayout.Button("Go Back", GUILayout.Height(buttonHeight))){
			popupDifficulty = false;
			titleMenu = true;
		}
		GUILayout.EndArea();
	}
	
	if(enterName){
		GUILayout.BeginArea(new Rect(Screen.width/2-buttonWidth/2, Screen.height/3, buttonWidth, Screen.height));
			GUILayout.BeginVertical();
			
				var currentPlayer = PlayerPrefs.GetString("playerName");
				if(currentPlayer != ""){
					if(GUILayout.Button("Continue as " + currentPlayer, GUILayout.Height(buttonHeight))){
						popupDifficulty = true;
						enterName = false;
					}
				}
				GUILayout.Space(20);

				GUILayout.Label("Enter your name, Space Cadet.");
				//playerName = "";
				playerName = GUILayout.TextArea(playerName, 25);
				playerName = Regex.Replace(playerName, "[^a-zA-Z0-9]", "");
				if(playerName == "")
						GUI.enabled = false;
				if(GUILayout.Button("Go", GUILayout.Height(buttonHeight))|| Event.current.keyCode == KeyCode.Return){
					PlayerPrefs.SetString("playerName", playerName);
					popupDifficulty = true;
					enterName = false;
				}
				GUI.enabled = true;
				GUILayout.Space(30);
				if(GUILayout.Button("Go Back", GUILayout.Height(buttonHeight))){
					enterName = false;
					titleMenu = true;
				}

			GUILayout.EndVertical();
		GUILayout.EndArea();
	}
	
	if(help){
		GUILayout.BeginArea(new Rect(Screen.width/2-buttonWidth/2, Screen.height/8, buttonWidth, buttonHeight*9));
			GUILayout.BeginVertical();
				GUILayout.Label("You are an astronaut, but your ship has run out of warp power, leaving you floating in space.");
				GUILayout.Label("You must shoot and destroy the right asteroids to power your warp drive to get home...");
				GUILayout.Label("...but you have limited missiles, so try not to miss or hit the wrong asteroids!");
				GUILayout.Label("Fill up your warp power three times to make it back home.");				
				GUILayout.Space(10);
				GUILayout.Label("Click where you want to shoot to fire a missile in that direction.");
				GUILayout.Label("Click on the button in the top right corner to see a question's picture.");
				GUILayout.Label("Click on the button in the top left corner to exit the game.");
				if(GUILayout.Button("Return", GUILayout.Height(buttonHeight))|| Event.current.keyCode == KeyCode.Return){
						titleMenu = true;
						help = false;
				}
			GUILayout.EndVertical();
		GUILayout.EndArea();
	}
}