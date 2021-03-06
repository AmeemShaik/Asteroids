private var gun:OTAnimatingSprite;              // gun sprite reference
private var initialized:boolean = false;        // initialization notifier
// This method will create an asteroid at a random position on screen and with
// relative min/max (0-1) size. An OTObject can be provided to act as a base to 
// determine the new size.
private var dp:int = 0;
public var currentProblem;
public var ammo:int;
public var explosionSFX : AudioClip;
public var laserSFX : AudioClip;
private var GameGuiCamera;
var bulletScript: Bullet;
function RandomBlock(r:Rect, min:Number, max:Number, o:OTObject)
{
    // Determine random 1-3 asteroid type
    var t:int = 1 + Mathf.Floor(Random.value * 3);
    // Determine random size modifier (min-max)
    var s:Number = min + Random.value * (max - min);
    var sprite:OTSprite = null;
    // Create a new asteroid
    switch (t)
    {
        case 1: sprite = OT.CreateSprite("asteroid1");
            break;
        case 2: sprite = OT.CreateSprite("asteroid2");
            break;
        case 3: sprite = OT.CreateSprite("asteroid3");
            break;
    }
    sprite.tag = "Finish";
    if (sprite != null)
    {
        // set sprite size
        if (o != null)
            sprite.size = o.size * s;
        else
            sprite.size = sprite.size * s;
        // Set sprite's random position
       	var xRandom = Random.value;
       	while((xRandom>0.3 && xRandom<0.7)||(xRandom>0.9)||(xRandom<0.1)){
       		xRandom = Random.value;
       	}
       	var yRandom = Random.value;
       	while((yRandom>0.9)||(yRandom<0.1)){
       		yRandom = Random.value;
       	}
        sprite.position = new Vector2(r.xMin + xRandom * r.width, r.yMin + yRandom * r.height);
        // Set sprote's random rotation
        sprite.rotation = Random.value * 360;
        // Set sprite's name
        sprite.depth = dp++;
        if (dp > 750) dp = 100;
    }
    return sprite;
}


// Create objects for this application
function CreateObjectPools()
{
	OT.PreFabricate("asteroid1",250);
	OT.PreFabricate("asteroid2",250);
	OT.PreFabricate("asteroid3",250);		
}

// application initialization
function Initialize()
{
	for(var c in Camera.allCameras){
		if(c.gameObject.name == "QuestionPanel"){
			GameGuiCamera = c.GetComponent.<GameGUI>();
		}
	}
	explosionSFX = Resources.Load("explosion");
	laserSFX = Resources.Load("laser");
	ammo = PlayerPrefs.GetInt("ammo");
	var objects = GameObject.FindGameObjectsWithTag("Finish");
	for(var j = 0; j < objects.length; j++){
			OT.DestroyObject(objects[j]);
	}
	GameGuiCamera.ammo = this.ammo;
	//camera.main.GetComponent.<GameGUI>().ammo = this.ammo;
	
    // Get reference to gun animation sprite
    gun = OT.ObjectByName("gun") as OTAnimatingSprite;
	// Because Javascript does not support C# delegate we have to notify our sprite class that 
	// we want to receive notification callbacks.
	// If we have initialized for callbacks our (!IMPORTANT->) 'public' declared call back 
	// functions will be asutomaticly called when an event takes place.
	// HINT : This technique can be used within a C# class as well.
    gun.InitCallBacks(this);
    
    // Create our object pool if we want.
    OT.objectPooling = true;
    if (OT.objectPooling)
        CreateObjectPools();
    // set our initialization notifier - we only want to initialize once
    initialized = true;
    var difficulty:int = PlayerPrefs.GetInt("difficulty");

    var numAsteroids: int = 0;
    switch(difficulty){
    	case 1:
    		numAsteroids = 5;
    		break;
    	case 2:
    		numAsteroids = 10;
    		break;
    	case 3:
    		numAsteroids = 15;
    		break;
    	default:
    		numAsteroids = 5;
    		break;
    }
    var choices = ["A","B","C","D"];
    
	if(currentProblem.HasChildNodes){
		var childNodes = currentProblem.ChildNodes;
		for(var cc=0; cc<childNodes.Count; cc++){
			if(childNodes[cc].Name=="correctAnswer")
				answer = currentProblem.ChildNodes[cc].InnerText;
		}
	}

    var correctAnswer:int = parseInt(answer)-1;
    for(var i = 0; i < numAsteroids; i++){
	   	var a:OTAnimatingSprite = RandomBlock(OT.view.worldRect, 0.6f, 1.2f, null);
	   	if(i<4){
		   	var name = a.name;
		   	var obj:GameObject = GameObject.Find(name);
		   	var astPosition = obj.transform.position;
		   	var textObj : GameObject = new GameObject("TextObject");
		   	textObj.tag = "Finish";
		   	textObj.transform.position = astPosition;
			var textMesh : TextMesh = textObj.AddComponent(TextMesh);
			textObj.AddComponent(MeshRenderer);
			var fontResource : Font = Resources.Load("Fonts/AgentOrange", Font);
			textMesh.font = fontResource;
			textMesh.fontSize = 500;
			textMesh.text = choices[i];
			textMesh.renderer.material = fontResource.material;
			obj.GetComponent.<Asteroid>().textObj = textObj;
			if(i == correctAnswer){
				obj.GetComponent.<Asteroid>().isCorrect = true;
			}
		}
	}
}

// This method will explode an asteroid
public function Explode(o:OTObject, bullet:Bullet, sound:boolean)
{
	if(sound && explosionSFX.isReadyToPlay){
		audio.PlayOneShot(explosionSFX, 0.2f);
	}
    // Determine how many debree has to be be created
    var blocks:int = 2 + Mathf.Floor(Random.value * 2);
    // Create debree
    for (var b:int = 0; b < blocks; b++)
    {
        // Shrink asteroid's rect to act as the random position container
        // for the debree
        var r:Rect = new Rect(
            o.rect.x + o.rect.width / 4,
            o.rect.y + o.rect.height / 4,
            o.rect.width / 8,
            o.rect.height / 8);
        // Create a debree that is relatively smaller than the asteroid that was detroyed
        var a:OTAnimatingSprite = RandomBlock(r, 0.65f, 0.8f, o);

        // Recusively explode 2 asteroids if they are big enough, to get a nice
        // exploding debree effect.
        if (b < 2 && a.size.x > 30)
            Explode(a, bullet, false);
    }
    // Notify that this asteroid has to be destroyed
    OT.DestroyObject(o);
}

// Update is called once per frame
function Update () {
    // only go one if Orthello is initialized
    if (!OT.isValid) return;

    // We call the application initialization function from Update() once 
    // because we want to be sure that all Orthello objects have been started.
    if (!initialized)
	{
        Initialize();
		return;
	}

    // Rotate the gun animation sprite towards the mouse on screen
    gun.RotateTowards(OT.view.mouseWorldPosition);
    // Rotate our bullet prototype as well so we will instantiate a
    // 'already rotated' bullet when we shoot
	//if(!bulletExists){
		// check if the left mouse button was clicked
	    if (Input.GetMouseButtonDown(0)&& GUIUtility.hotControl == 0&&ammo>0)
	    {   
	    	ammo--;
	    	audio.PlayOneShot(laserSFX);
	    	
	    	GameGuiCamera.ammo = this.ammo;
	        // Create a new bullet
	        
	        var nBullet:OTSprite = OT.CreateSprite("bullet");
	      
	        // Set bullet's position at approximately the gun's shooting barrel
	        if(nBullet!= null){
	        	GameObject.Find(nBullet.name).GetComponent(Bullet).Start();
		        nBullet.position = gun.position + gun.yVector * (gun.size.y / 2);
		    	nBullet.rotation = gun.rotation;
		        // Play the gun's shooting animation frameset once
	        	gun.PlayOnce("shoot");
	        }
	      // yield WaitForSeconds(5); 
	    }
	//}
	/*if(ammo==0&&(GameGuiCamera.ammoEnd ==false)){
		GameGuiCamera.ammoEnd =true;
	}*/
   /* // If we have less than 15 objects within Orthello we will create a random asteroid
    if (OT.objectCount <= 12)
        RandomBlock(OT.view.worldRect, 0.6f, 1.2f, null);     */
}

// The OnAnimationFinish delegate will be called when an animation or animation frameset
// finishes playing.
public function OnAnimationFinish(owner:OTObject)
{
    // Because the only animation that finishes will be the gun's 'shoot' animation frameset
    // we know that we have to switch to the gun's looping 'idle' animation frameset
	if (owner == gun)	
		gun.PlayLoop("idle");
}