#pragma strict

function Start () {
	var doc = new XmlDocument();
	doc.Load("Assets/Resources/Statistics/Stats.xml");
	var element = doc.CreateElement("question");
	var x=doc.GetElementsByTagName("responded")[0];
	x.AppendChild(element);
	doc.Save("Assets/Resources/Statistics/Stats1.xml");
}

function Update () {

}