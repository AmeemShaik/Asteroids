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
public var ammo;
public var playerName = "Default Cadet";

function OnGUI() {

	if(titleMenu){
		GUILayout.BeginArea(Rect(Screen.width/2 - buttonWidth/2, Screen.height/2 - 200, buttonWidth, 500));
			GUILayout.Label("Shooting STARS", titleStyle);
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
		if(GUILayout.Button("Go Back", GUILayout.Height(buttonHeight))){
			popupDifficulty = false;
			titleMenu = true;
		}
		GUILayout.EndArea();
	}
	
	if(enterName){
		GUILayout.BeginArea(new Rect(Screen.width/2-buttonWidth/2, Screen.height/3, buttonWidth, buttonHeight*5));
			GUILayout.BeginVertical();
			
				var currentPlayer = PlayerPrefs.GetString("playerName");
				if(currentPlayer != "Default Cadet"){
					if(GUILayout.Button("Continue as " + currentPlayer, GUILayout.Height(buttonHeight))){
						Application.LoadLevel("mainLevel");
					}
				}
				GUILayout.Space(30);

				GUILayout.Label("Enter your name, Space Cadet.");
				//playerName = "";
				playerName = GUILayout.TextArea(playerName, 25);
				playerName = Regex.Replace(playerName, "[^a-zA-Z0-9 ]", "");
				if(playerName != ""){
					if(GUILayout.Button("Go", GUILayout.Height(buttonHeight))|| Event.current.keyCode == KeyCode.Return){
						PlayerPrefs.SetString("playerName", playerName);
						popupDifficulty = true;
						enterName = false;
					}
				}

			GUILayout.EndVertical();
		GUILayout.EndArea();
	}
	
	if(help){
		GUILayout.BeginArea(new Rect(Screen.width/2-buttonWidth/2, Screen.height/2-buttonHeight/2, buttonWidth, buttonHeight*5));
			GUILayout.BeginVertical();
				GUILayout.Label("TUTORIAL TEXT HERE.");
				if(GUILayout.Button("Return", GUILayout.Height(buttonHeight))|| Event.current.keyCode == KeyCode.Return){
						titleMenu = true;
						help = false;
				}
			GUILayout.EndVertical();
		GUILayout.EndArea();
	}
}