using UnityEngine;
using System.Xml;
using System.IO;
using System.Collections;
using System.Text;
 
// a very simplistic level upload and random name generator script
 
public class LevelUploader : MonoBehaviour
{
	void StartUpload()
	{
		StartCoroutine("UploadLevel");

	}
   
	IEnumerator UploadLevel()   
	{
		string name = PlayerPrefs.GetString("playerName");
		//making a dummy xml level file
		XmlDocument map = new XmlDocument();
		if(System.IO.File.Exists (Application.dataPath + "/" + name + ".xml")){
			Debug.Log("player exists at Assets/Resources/Statistics/" + name + ".xml");
			map.Load (Application.dataPath + "/" + name + ".xml");
		} else {
			Debug.Log ("Player doesn't exist!");
			yield break;
		}
		//converting the xml to bytes to be ready for upload
		byte[] levelData =Encoding.UTF8.GetBytes(map.OuterXml);
	   
		//generate a long random file name , to avoid duplicates and overwriting
		string fileName = Path.GetRandomFileName();
		fileName = fileName.Substring(0,4);
		fileName = fileName.ToUpper();
		fileName = name + "_" + fileName + ".xml";
	   
		//if you save the generated name, you can make people be able to retrieve the uploaded file, without the needs of listings
		//just provide the level code name , and it will retrieve it just like a qrcode or something like that, please read below the method used to validate the upload,
		//that same method is used to retrieve the just uploaded file, and validate it
		//this method is similar to the one used by the popular game bike baron
		//this method saves you from the hassle of making complex server side back ends which enlists available levels
		//this way you could enlist outstanding levels just by posting the levels code on a blog or forum, this way its easier to share, without the need of user accounts or install procedures
		WWWForm form = new WWWForm();
 
		print("form created ");
	   
		form.AddField("action", "level upload");
 
		form.AddField("file","file");
 
		form.AddBinaryData ( "file", levelData, fileName,"text/xml");
 
		print("binary data added ");
		//change the url to the url of the php file
		WWW w = new WWW("http://mpittman.com/UploadTest/LevelUpload.php",form);
		print("www created");
 
		yield return w;
		print("after yield w");
		if (w.error != null)
		{
			print("error");
			print ( w.error );    
		}
		else
		{
			//this part validates the upload, by waiting 5 seconds then trying to retrieve it from the web
			if(w.uploadProgress == 1 && w.isDone)
			{
				yield return new WaitForSeconds(5);
				//change the url to the url of the folder you want it the levels to be stored, the one you specified in the php file
				print("http://mpittman.com/UploadTest/Levels/" + fileName);
				WWW w2 = new WWW("http://mpittman.com/UploadTest/Levels/" + fileName);
				yield return w2;
				if(w2.error != null)
				{
					print("error 2");
					print ( w2.error );  
				}
				else
				{
					//then if the retrieval was successful, validate its content to ensure the level file integrity is intact
					if(w2.text != null && w2.text != "")
					{
						print ( "Finished Uploading Level " + fileName);
					}
					else
					{
						print ( "Level File " + fileName + " is Empty");
					}
				}
			}     
		}
	}
   
	void OnGUI()
	{
		if(GUILayout.Button("Submit Stats"))
		{
			StartUpload();
		}
	}
}