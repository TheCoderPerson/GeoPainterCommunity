@CustomEditor(GeoPainter)
class GeoPainterEditor extends Editor {
	
	static var appTitle = "Geo Painter Tools";
	private var isPainting = false;
	private var myGroups:Array ;
	private var myLibrary:Array;
	private var myObjToInstArray : Array;
	
	private var showGroups : boolean = true;
	private var showPaint : boolean = true;
	private var showBiblio : boolean = true;
    private var showRandom: boolean = true;
    private var drawDebug: boolean = true;
	private var currentGroup;
	private var currentGroupScript;
	private var copyFromIndex = 0;
    private var myCopyFromPop: Array = new Array();
    //private var tmpMinSlopeVal: float = 5;
    //private var minSlopeLimit: float = 0;
    //private var tmpMaxSlopeVal: float = 15;
    //private var maxSlopeLimit: float = 90;
    //private var minAltitudeVal: float = -2000;
    //private var minAltitudeLimit: float = -10000;
    //private var maxAltitudeVal: float = 2000;
    //private var maxAltitudeLimit: float = 10000;
	

	
	//********************************************************************************************
	//*** OnInspectorGUI
	//********************************************************************************************
	function OnInspectorGUI ()
	{
		//Check if an object has been deleted
		if(currentGroupScript != null && currentGroupScript.myPointsList.Count != 0)
		{
			for(var i=currentGroupScript.myPointsList.Count-1;i>=0;i--)
			{
				
				var element = currentGroupScript.myPointsList[i];
				
				if(element.go == null)
				{
				currentGroupScript.myPointsList.RemoveAt(i);
				}
			}
		}
		
	//	myGroups = target.myGroups;
		//GROUPS
		//myStyleBoldText.fontStyle = FontStyle.Bold;
		
		
		if(myGroups == null) 
		{
			myGroups = new Array();
			for( obj in target.myGroupsBuiltIn)
			{
				if(obj != null)
				{
					myGroups.Add(obj);
				}
			}

	
			
			target.groupSelIndex = 1;
			
		}
		
		
        showGroups = EditorGUILayout.Foldout(showGroups, "GROUPS", EditorStyles.boldLabel);
        drawDebug = EditorGUILayout.Toggle("Draw debug slope and altitude?", drawDebug);
		if(showGroups && !isPainting)
		{
			
			//Add / Remove Groups
			EditorGUILayout.Space();
			EditorGUILayout.BeginHorizontal();
			//EditorGUILayout.LabelField("Add","");
			
			if(GUILayout.Button ("+")) {
				addGroup();
				target.myGroupsBuiltIn = myGroups.ToBuiltin(GameObject);
			}

			EditorGUILayout.EndHorizontal();
			EditorGUILayout.Space();
			if(myGroups.length > 0)
			{
				
				//Groups Display
				var nbrTemp = 1;
				for(var obj in myGroups)
				{
					
					var myLabel = "" + nbrTemp + ": ";
					EditorGUILayout.BeginHorizontal();
					if(nbrTemp == target.groupSelIndex) 
					{
						obj.name = EditorGUILayout.TextField(myLabel + " (EDIT)",obj.name);
					} else
					{
						obj.name = EditorGUILayout.TextField(myLabel + "  ",obj.name);
					}
					if(GUILayout.Button ("EDIT",GUILayout.Width(100))) {
						target.groupSelIndex = nbrTemp;
						currentGroup = myGroups[nbrTemp-1];
						currentGroupScript = currentGroup.GetComponent("GeoPainterGroup");
						myLibrary = new Array(currentGroupScript.myLibraryBuiltIn);
						var position = currentGroup.transform.position;
						SceneView.lastActiveSceneView.pivot = position;
						SceneView.lastActiveSceneView.Repaint();
                    }
                    //if (EditorGUILayout.TextField.isFocused) {
                    //    target.groupSelIndex = nbrTemp;
                    //    currentGroup = myGroups[nbrTemp - 1];
                    //    currentGroupScript = currentGroup.GetComponent("GeoPainterGroup");
                    //    myLibrary = new Array(currentGroupScript.myLibraryBuiltIn);
                    //    var position = currentGroup.transform.position;
                    //    SceneView.lastActiveSceneView.pivot = position;
                    //    SceneView.lastActiveSceneView.Repaint();
                    //}
					if(GUILayout.Button ("REMOVE",GUILayout.Width(100))) {
						removeGroup(nbrTemp,false);
						target.myGroupsBuiltIn = myGroups.ToBuiltin(GameObject);
					}
					if(GUILayout.Button ("RELEASE",GUILayout.Width(100))) {
					
						target.groupSelIndex = nbrTemp;
						currentGroup = myGroups[nbrTemp-1];
						currentGroupScript = currentGroup.GetComponent("GeoPainterGroup");
						myLibrary = new Array(currentGroupScript.myLibraryBuiltIn);
						position = currentGroup.transform.position;
						SceneView.lastActiveSceneView.pivot = position;
						SceneView.lastActiveSceneView.Repaint();
						
						updatePrefab(true);
						removeGroup(nbrTemp,true);
						target.myGroupsBuiltIn = myGroups.ToBuiltin(GameObject);
					}
					EditorGUILayout.EndHorizontal();
					nbrTemp++;

				}
				
				
			}
		}
		
		//PANELS
		if(myGroups.length > 0)
		{
			
			currentGroup = myGroups[target.groupSelIndex-1];
			currentGroupScript = currentGroup.GetComponent("GeoPainterGroup");
			
			
				//BIBLIO
			
			if(myLibrary == null)
			{
				myLibrary = new Array(currentGroupScript.myLibraryBuiltIn);
			}
			
			EditorGUILayout.Space();
			EditorGUILayout.Space();
			EditorGUILayout.Space();
			showBiblio = EditorGUILayout.Foldout(showBiblio, "LIBRARY",EditorStyles.boldLabel);
			if(showBiblio && !isPainting)
			{
				EditorGUILayout.Space();
				EditorGUILayout.Space();
				EditorGUILayout.Space();
				/*
				//Method
				target.bibSortIndex = EditorGUILayout.Popup("Method: ", target.bibSortIndex, target.bibSortMethod);
				if(target.bibSortIndex == 1) {
					target.bibSoloSelect = EditorGUILayout.IntField("Selected Element:", target.bibSoloSelect);
				}
				
				EditorGUILayout.Space();
				EditorGUILayout.Space();
				*/
				//Elements
				var x : int = 0;
				if(GUILayout.Button ("ADD OBJECT")) {
					myLibrary.Add(null);
					currentGroupScript.myLibraryBuiltIn = myLibrary.ToBuiltin(GameObject);
					
				}
				
				for(x = 0; x < myLibrary.length; x++) {
					EditorGUILayout.BeginHorizontal();
						EditorGUILayout.BeginVertical();
						EditorGUILayout.LabelField("Object #"+x+" :");
                        // JO ENTER Percent chance field here.
                            myLibrary[x] = EditorGUILayout.ObjectField(myLibrary[x], typeof (GameObject), false);
                            //Probability
                            //EditorGUILayout.BeginHorizontal();
                            //EditorGUILayout.PrefixLabel("Prabability ");
                            //currentGroupScript.sprayRadius = EditorGUILayout.FloatField(currentGroupScript.sprayRadius);
                            //if (currentGroupScript.sprayRadius <= 0) currentGroupScript.sprayRadius = 0;
                            //EditorGUILayout.EndHorizontal();
							
							if(GUILayout.Button ("REMOVE")) {
								myLibrary.RemoveAt(x);
								currentGroupScript.myLibraryBuiltIn = myLibrary.ToBuiltin(GameObject);
								break;
							}
							
						EditorGUILayout.EndVertical();
						
						if(myLibrary[x] != null)
						{
							var previewTex;
							
							#if !UNITY_3_4 && !UNITY_3_5
							previewTex = AssetPreview.GetAssetPreview(myLibrary[x]);
							#else
							previewTex = EditorUtility.GetAssetPreview(myLibrary[x]);
							#endif
							GUILayout.Button( previewTex,GUILayout.Width(100),GUILayout.Height(100));
						}
							
					EditorGUILayout.EndHorizontal();
					GUILayout.Space(20);
				}
				if(GUI.changed)
				{
					currentGroupScript.myLibraryBuiltIn = myLibrary.ToBuiltin(GameObject);
				}
				GUI.changed = false;
				if(myLibrary.length != 0)
				{
					if(target.bibSoloSelect > (myLibrary.length-1))
					target.bibSoloSelect = (myLibrary.length-1);
				}
				if(target.bibSoloSelect < 0)
				target.bibSoloSelect = 0;
				EditorGUILayout.Space();
				if(GUILayout.Button("Update Prefabs",GUILayout.Height(30)))
				{
					updatePrefab(false);
					randomize();
				}
				if (GUILayout.Button("Replace Prefab",GUILayout.Height(30)))
				{
					replacePrefab();
				}
			}//End Biblio		
			
			
			
			
			
			
			
			
			
			//PAINT
			EditorGUILayout.Space();
			EditorGUILayout.Space();
			EditorGUILayout.Space();
			showPaint = EditorGUILayout.Foldout(showPaint, "PAINT",EditorStyles.boldLabel);
			

			if(showPaint)
			{
				EditorGUILayout.Space();
				EditorGUILayout.Space();
				EditorGUILayout.Space();
				target.paintLayer = EditorGUILayout.LayerField("Paint Layer:",target.paintLayer);
				EditorGUILayout.Space();
				if(!isPainting)
				{
				
					if(GUILayout.Button("Start Painting",GUILayout.Height(40)))
					{
						target.rndAuto = false;
						myObjToInstArray = new Array();
						isPainting = true;
						
					}
				}
				else
				{
					if(GUILayout.Button("Stop Painting  (CTRL+Click) = Paint (SHIFT+Click) = Erase",GUILayout.Height(40)))
					{
						target.myGroupsBuiltIn = myGroups.ToBuiltin(GameObject);
						isPainting = false;
						
					}
				}
				
                if (GUILayout.Button("Clean Painting", GUILayout.Height(30)) && EditorUtility.DisplayDialog("Delete prefabs?", "Are you sure you want to delete all the prefabs that have been painted in the " + myGroups[target.groupSelIndex - 1].name + " group?", "Delete", "Do Not Delete"))
				{
					for(i=currentGroupScript.myPointsList.Count-1;i>=0;i--)
					{
						element = currentGroupScript.myPointsList[i];
						DestroyImmediate(element.go);
						currentGroupScript.myPointsList.RemoveAt(i);
					}
				}
				//Distance Radius
				EditorGUILayout.BeginHorizontal();
				EditorGUILayout.PrefixLabel("Distance Radius ");
                EditorGUILayout.PrefixLabel("(D, SHIFT+D): ");
                //JO currentGroupScript.distanceRadius
				currentGroupScript.distanceRadius = EditorGUILayout.FloatField(currentGroupScript.distanceRadius);
				if(currentGroupScript.distanceRadius <= 0) currentGroupScript.distanceRadius =0;
				EditorGUILayout.EndHorizontal();
				
				//Spray Radius
				EditorGUILayout.BeginHorizontal();
				EditorGUILayout.PrefixLabel("Spray Radius ");
                EditorGUILayout.PrefixLabel("(S, SHIFT+S): ");
                //JO currentGroupScript.sprayRadius
				currentGroupScript.sprayRadius = EditorGUILayout.FloatField(currentGroupScript.sprayRadius);
				if(currentGroupScript.sprayRadius <= 0) currentGroupScript.sprayRadius =0;
				EditorGUILayout.EndHorizontal();
				//Delete Radius
				EditorGUILayout.BeginHorizontal();
				EditorGUILayout.PrefixLabel("Delete Radius");
                EditorGUILayout.PrefixLabel(" (C, SHIFT+C): ");
                //JO currentGroupScript.deleteRadius
				currentGroupScript.deleteRadius = EditorGUILayout.FloatField(currentGroupScript.deleteRadius);
				if(currentGroupScript.deleteRadius <= 0) currentGroupScript.deleteRadius =0;
                EditorGUILayout.EndHorizontal();
                // Slope
                EditorGUILayout.Space();
                EditorGUILayout.Space();
                EditorGUILayout.LabelField("Slope Limits");
                currentGroupScript.minSlopeVal = EditorGUILayout.FloatField("Minimum Slope Angle:", currentGroupScript.minSlopeVal);
                currentGroupScript.maxSlopeVal = EditorGUILayout.FloatField("Maximum Slope Angle:", currentGroupScript.maxSlopeVal);
                EditorGUILayout.Space();
                EditorGUILayout.Space();
                // Altitude
                EditorGUILayout.Space();
                EditorGUILayout.Space();
                EditorGUILayout.LabelField("Altitude Limits");
                currentGroupScript.minAltitudeVal = EditorGUILayout.FloatField("Minimum Altitude Height:", currentGroupScript.minAltitudeVal);
                currentGroupScript.maxAltitudeVal = EditorGUILayout.FloatField("Maximum Altitude Height:", currentGroupScript.maxAltitudeVal);
                EditorGUILayout.Space();
                EditorGUILayout.Space();

				currentGroupScript.useNormal = EditorGUILayout.Toggle("Use Normal ?", currentGroupScript.useNormal);
				
			}
			//RandomSection
			EditorGUILayout.Space();
			EditorGUILayout.Space();
			EditorGUILayout.Space();
			showRandom = EditorGUILayout.Foldout(showRandom, "RANDOMIZE",EditorStyles.boldLabel );
			if(showRandom && !isPainting)
			{
			EditorGUILayout.Space();
			EditorGUILayout.Space();
			EditorGUILayout.Space();
                currentGroupScript.rndSeed = EditorGUILayout.IntSlider("Seed: ", currentGroupScript.rndSeed, 1, 12600);
				
				//POSITION
				EditorGUILayout.Space();
				GUILayout.Label("POSITION",EditorStyles.boldLabel);
				EditorGUILayout.Space();
				
				EditorGUILayout.BeginHorizontal();
					EditorGUILayout.BeginVertical();
						EditorGUILayout.LabelField("","",GUILayout.Width(3));
						EditorGUILayout.LabelField("x:","",GUILayout.Width(3));
						EditorGUILayout.LabelField("y:","",GUILayout.Width(3));
						EditorGUILayout.LabelField("z:","",GUILayout.Width(3));
					EditorGUILayout.EndVertical();
					
					EditorGUILayout.BeginVertical();
						EditorGUILayout.LabelField("","Offset",GUILayout.Width(200));
						currentGroupScript.offPosX = EditorGUILayout.FloatField("",currentGroupScript.offPosX,GUILayout.Width(200));
						currentGroupScript.offPosY = EditorGUILayout.FloatField("",currentGroupScript.offPosY,GUILayout.Width(200));
						currentGroupScript.offPosZ = EditorGUILayout.FloatField("",currentGroupScript.offPosZ,GUILayout.Width(200));
					EditorGUILayout.EndVertical();
					
					EditorGUILayout.BeginVertical();
						EditorGUILayout.LabelField("","Random Min",GUILayout.Width(200));
						currentGroupScript.rndPosMinX = EditorGUILayout.FloatField("",currentGroupScript.rndPosMinX,GUILayout.Width(200));
						currentGroupScript.rndPosMinY = EditorGUILayout.FloatField("",currentGroupScript.rndPosMinY,GUILayout.Width(200));
						currentGroupScript.rndPosMinZ = EditorGUILayout.FloatField("",currentGroupScript.rndPosMinZ,GUILayout.Width(200));
					EditorGUILayout.EndVertical();
					
					EditorGUILayout.BeginVertical();
						EditorGUILayout.LabelField("","Random Max",GUILayout.Width(200));
						currentGroupScript.rndPosMaxX = EditorGUILayout.FloatField("",currentGroupScript.rndPosMaxX,GUILayout.Width(200));
						currentGroupScript.rndPosMaxY = EditorGUILayout.FloatField("",currentGroupScript.rndPosMaxY,GUILayout.Width(200));
						currentGroupScript.rndPosMaxZ = EditorGUILayout.FloatField("",currentGroupScript.rndPosMaxZ,GUILayout.Width(200));
					EditorGUILayout.EndVertical();
				
				EditorGUILayout.EndHorizontal();
				
				//ROTATION
				EditorGUILayout.Space();
				GUILayout.Label("ROTATION",EditorStyles.boldLabel);
				EditorGUILayout.Space();
				
				EditorGUILayout.BeginHorizontal();
				EditorGUILayout.BeginVertical();
				EditorGUILayout.LabelField("","",GUILayout.Width(3));
				EditorGUILayout.LabelField("x:","",GUILayout.Width(3));
				EditorGUILayout.LabelField("y:","",GUILayout.Width(3));
				EditorGUILayout.LabelField("z:","",GUILayout.Width(3));
				EditorGUILayout.EndVertical();
				
				EditorGUILayout.BeginVertical();
				EditorGUILayout.LabelField("","Offset",GUILayout.Width(200));
				currentGroupScript.offRotX = EditorGUILayout.FloatField("",currentGroupScript.offRotX,GUILayout.Width(200));
				currentGroupScript.offRotY = EditorGUILayout.FloatField("",currentGroupScript.offRotY,GUILayout.Width(200));
				currentGroupScript.offRotZ = EditorGUILayout.FloatField("",currentGroupScript.offRotZ,GUILayout.Width(200));
				EditorGUILayout.EndVertical();
				
				EditorGUILayout.BeginVertical();
				EditorGUILayout.LabelField("","Random Min",GUILayout.Width(200));
				currentGroupScript.rndRotMinX = EditorGUILayout.FloatField("",currentGroupScript.rndRotMinX,GUILayout.Width(200));
				currentGroupScript.rndRotMinY = EditorGUILayout.FloatField("",currentGroupScript.rndRotMinY,GUILayout.Width(200));
				currentGroupScript.rndRotMinZ = EditorGUILayout.FloatField("",currentGroupScript.rndRotMinZ,GUILayout.Width(200));
				EditorGUILayout.EndVertical();
				
				EditorGUILayout.BeginVertical();
				EditorGUILayout.LabelField("","Random Max",GUILayout.Width(200));
				currentGroupScript.rndRotMaxX = EditorGUILayout.FloatField("",currentGroupScript.rndRotMaxX,GUILayout.Width(200));
				currentGroupScript.rndRotMaxY = EditorGUILayout.FloatField("",currentGroupScript.rndRotMaxY,GUILayout.Width(200));
				currentGroupScript.rndRotMaxZ = EditorGUILayout.FloatField("",currentGroupScript.rndRotMaxZ,GUILayout.Width(200));
				EditorGUILayout.EndVertical();
				
				EditorGUILayout.EndHorizontal();
				
				
				//Scale
				
				EditorGUILayout.Space();
				GUILayout.Label("SCALE",EditorStyles.boldLabel);
				EditorGUILayout.Space();
				currentGroupScript.scaleUniform = EditorGUILayout.Toggle("Uniform:", currentGroupScript.scaleUniform );
				
				if(!currentGroupScript.scaleUniform)
				{
					EditorGUILayout.BeginHorizontal();
					EditorGUILayout.BeginVertical();
					EditorGUILayout.LabelField("","",GUILayout.Width(3));
					EditorGUILayout.LabelField("x:","",GUILayout.Width(3));
					EditorGUILayout.LabelField("y:","",GUILayout.Width(3));
					EditorGUILayout.LabelField("z:","",GUILayout.Width(3));
					EditorGUILayout.EndVertical();
				
					EditorGUILayout.BeginVertical();
					EditorGUILayout.LabelField("","Offset",GUILayout.Width(200));
					currentGroupScript.offSclX = EditorGUILayout.FloatField("",currentGroupScript.offSclX,GUILayout.Width(200));
					currentGroupScript.offSclY = EditorGUILayout.FloatField("",currentGroupScript.offSclY,GUILayout.Width(200));
					currentGroupScript.offSclZ = EditorGUILayout.FloatField("",currentGroupScript.offSclZ,GUILayout.Width(200));
					EditorGUILayout.EndVertical();
					
					EditorGUILayout.BeginVertical();
					EditorGUILayout.LabelField("","Random Min",GUILayout.Width(200));
					currentGroupScript.rndSclMinX = EditorGUILayout.FloatField("",currentGroupScript.rndSclMinX,GUILayout.Width(200));
					currentGroupScript.rndSclMinY = EditorGUILayout.FloatField("",currentGroupScript.rndSclMinY,GUILayout.Width(200));
					currentGroupScript.rndSclMinZ = EditorGUILayout.FloatField("",currentGroupScript.rndSclMinZ,GUILayout.Width(200));
					EditorGUILayout.EndVertical();
					
					EditorGUILayout.BeginVertical();
					EditorGUILayout.LabelField("","Random Max",GUILayout.Width(200));
					currentGroupScript.rndSclMaxX = EditorGUILayout.FloatField("",currentGroupScript.rndSclMaxX,GUILayout.Width(200));
					currentGroupScript.rndSclMaxY = EditorGUILayout.FloatField("",currentGroupScript.rndSclMaxY,GUILayout.Width(200));
					currentGroupScript.rndSclMaxZ = EditorGUILayout.FloatField("",currentGroupScript.rndSclMaxZ,GUILayout.Width(200));
					EditorGUILayout.EndVertical();
					
					EditorGUILayout.EndHorizontal();
				} else
				{
					EditorGUILayout.BeginVertical();
					EditorGUILayout.BeginHorizontal();
					EditorGUILayout.LabelField("","",GUILayout.Width(30));
					EditorGUILayout.LabelField("","Offset",GUILayout.Width(200));
					EditorGUILayout.LabelField("","Random Min",GUILayout.Width(200));
					EditorGUILayout.LabelField("","Random Max",GUILayout.Width(200));
					EditorGUILayout.EndHorizontal();
					
					EditorGUILayout.BeginHorizontal();
					EditorGUILayout.LabelField("All:","",GUILayout.Width(30));
					currentGroupScript.offSclX = EditorGUILayout.FloatField("",currentGroupScript.offSclX,GUILayout.Width(200));
					currentGroupScript.rndSclMinX = EditorGUILayout.FloatField("",currentGroupScript.rndSclMinX,GUILayout.Width(200));
					currentGroupScript.rndSclMaxX = EditorGUILayout.FloatField("",currentGroupScript.rndSclMaxX,GUILayout.Width(200));
					
					
					EditorGUILayout.EndVertical();
					EditorGUILayout.EndHorizontal();
				}
				
				
				//AUTO
				EditorGUILayout.Space();
				GUILayout.Label("UPDATE",EditorStyles.boldLabel);
				EditorGUILayout.Space();
				target.rndAuto = GUILayout.Toggle(target.rndAuto,"Auto Update","button");
				if(GUILayout.Button("Randomize",GUILayout.Height(30)))
				{
					randomize();
				}
				
				if(GUI.changed && target.rndAuto)
				{
					randomize();
					GUI.changed = false;
				}
				
				myCopyFromPop = new Array();
				for(i=0;i<myGroups.length;i++)
				{
					myCopyFromPop.Add(myGroups[i].name);
				}
				
				EditorGUILayout.Space();
				GUILayout.Label("COPY & PASTE FROM GROUP",EditorStyles.boldLabel);
				EditorGUILayout.Space();
				
				EditorGUILayout.BeginHorizontal();
				copyFromIndex = EditorGUILayout.Popup(copyFromIndex, myCopyFromPop.ToBuiltin(String));
				if(GUILayout.Button("COPY",GUILayout.Width(100)))
				{
					copySettings();
				}
				EditorGUILayout.EndHorizontal();
				
			}
			

		}//End Panel
	}
	
	//********************************************************************************************
	//*** Update Prefab
	//********************************************************************************************
	function copySettings()
	{
		myTempScript = myGroups[copyFromIndex].GetComponent("GeoPainterGroup");
		
        currentGroupScript.minSlopeVal = myTempScript.minSlopeVal;
        currentGroupScript.maxSlopeVal = myTempScript.maxSlopeVal;
        currentGroupScript.minAltitudeVal = myTempScript.minAltitudeVal;
        currentGroupScript.maxAltitudeVal = myTempScript.maxAltitudeVal;
        
		currentGroupScript.rndSeed = myTempScript.rndSeed;
		currentGroupScript.offPosX  = myTempScript.offPosX;
		currentGroupScript.offPosY  = myTempScript.offPosY;
		currentGroupScript.offPosZ  = myTempScript.offPosZ;
		currentGroupScript.rndPosMinX  = myTempScript.rndPosMinX;
		currentGroupScript.rndPosMinY = myTempScript.rndPosMinY;
		currentGroupScript.rndPosMinZ  = myTempScript.rndPosMinZ;
		currentGroupScript.rndPosMaxX  = myTempScript.rndPosMaxX;
		currentGroupScript.rndPosMaxY  = myTempScript.rndPosMaxY;
		currentGroupScript.rndPosMaxZ = myTempScript.rndPosMaxZ;
		currentGroupScript.offRotX  = myTempScript.offRotX;
		currentGroupScript.offRotY  = myTempScript.offRotY;
		currentGroupScript.offRotZ  = myTempScript.offRotZ;
		currentGroupScript.rndRotMinX  = myTempScript.rndRotMinX;
		currentGroupScript.rndRotMinY  = myTempScript.rndRotMinY;
		currentGroupScript.rndRotMinZ  = myTempScript.rndRotMinZ;
		currentGroupScript.rndRotMaxX  = myTempScript.rndRotMaxX;
		currentGroupScript.rndRotMaxY  = myTempScript.rndRotMaxY;
		currentGroupScript.rndRotMaxZ  = myTempScript.rndRotMaxZ;
		currentGroupScript.scaleUniform  = myTempScript.scaleUniform;
		currentGroupScript.offSclX  = myTempScript.offSclX;
		currentGroupScript.offSclY  = myTempScript.offSclY;
		currentGroupScript.offSclZ  = myTempScript.offSclZ;
		currentGroupScript.rndSclMinX  = myTempScript.rndSclMinX;
		currentGroupScript.rndSclMinY  = myTempScript.rndSclMinY;
		currentGroupScript.rndSclMinZ  = myTempScript.rndSclMinZ;
		currentGroupScript.rndSclMaxX  = myTempScript.rndSclMaxX;
		currentGroupScript.rndSclMaxY  = myTempScript.rndSclMaxY;
		currentGroupScript.rndSclMaxZ  = myTempScript.rndSclMaxZ;
		
		
		
	}
	
	//********************************************************************************************
	//*** Update Prefab
	//********************************************************************************************
	function updatePrefab(_release)
	{
			Undo.RegisterSceneUndo("GeoPainter Update Prefab");
			for (element in currentGroupScript.myPointsList)
			{
				
				//EditorUtility.ReconnectToLastPrefab(element.go);
				PrefabUtility.ReconnectToLastPrefab(element.go);
				//EditorUtility.ResetGameObjectToPrefabState(element.go);
				PrefabUtility.ResetToPrefabState(element.go);
            }

            //for (element in currentGroupScript.myPointsList) {
            //    // Register root object for undo.
            //    Undo.RegisterCreatedObjectUndo(element.go, "GeoPainter Update Prefab");
            //    Undo.RecordObject(myGameObject.transform, "Zero Transform Position");
            //    myGameObject.transform.position = Vector3.zero;
            //}


	}
	//********************************************************************************************
	//*** Replace Prefab
	//********************************************************************************************	
	function replacePrefab()
	{
		Undo.RegisterSceneUndo("Replace Prefab");
		for(element in currentGroupScript.myPointsList)
		{
			DestroyImmediate(element.go);
			
			var myRandom = Random.Range(0, currentGroupScript.myLibraryBuiltIn.length);
			var objToInst = currentGroupScript.myLibraryBuiltIn[parseInt(myRandom)];
			//var myNewObject = EditorUtility.InstantiatePrefab(objToInst);
			var myNewObject = PrefabUtility.InstantiatePrefab(objToInst);
			myNewObject.transform.position = element.pos;
			myNewObject.transform.rotation = Quaternion.identity;
			element.scale = myNewObject.transform.localScale;
			element.go = myNewObject;
			randomizeSolo(element);
			if(currentGroup.transform.childCount == 0)
			{
				currentGroup.transform.position = myNewObject.transform.position;
				myNewObject.transform.parent = currentGroup.transform;
			} else {
				myNewObject.transform.parent = currentGroup.transform;
			}
		}
	}
	//********************************************************************************************
	//*** Randomize transform
	//********************************************************************************************
	function randomize()
	{
		Undo.RegisterSceneUndo("GeoPainter Randomize");
		//Random.seed = currentGroupScript.rndSeed;
        Random.InitState(currentGroupScript.rndSeed);
		for (element in currentGroupScript.myPointsList)
		{
			randomizeSolo(element);
		}	
	}
	//********************************************************************************************
	//*** Randomize transform solo
	//********************************************************************************************	
	function randomizeSolo(element)
	{
		//Random.seed = currentGroupScript.rndSeed;
		var obj : Transform = element.go.transform;
		
		var myRot = Quaternion.identity;
		if(element.useNormal)
		{
			//myRot = Quaternion.LookRotation(hit.normal);
			myRot = Quaternion.FromToRotation(obj.up, element.normal) * obj.rotation;
		}
		obj.position = element.pos;
		obj.rotation = myRot;
		obj.localScale = element.scale;

		//Position
		tmpPosX = currentGroupScript.offPosX + Random.Range(currentGroupScript.rndPosMinX, currentGroupScript.rndPosMaxX);
		tmpPosY = currentGroupScript.offPosY + Random.Range(currentGroupScript.rndPosMinY, currentGroupScript.rndPosMaxY);
		tmpPosZ = currentGroupScript.offPosZ + Random.Range(currentGroupScript.rndPosMinZ, currentGroupScript.rndPosMaxZ);
		obj.Translate(tmpPosX, tmpPosY, tmpPosZ);
		
		//Rotation
		tmpRotX = currentGroupScript.offRotX + Random.Range(currentGroupScript.rndRotMinX, currentGroupScript.rndRotMaxX);
		tmpRotY = currentGroupScript.offRotY + Random.Range(currentGroupScript.rndRotMinY, currentGroupScript.rndRotMaxY);
		tmpRotZ = currentGroupScript.offRotZ + Random.Range(currentGroupScript.rndRotMinZ, currentGroupScript.rndRotMaxZ);
		obj.Rotate(tmpRotX, tmpRotY, tmpRotZ);
		
		//Scale

		tmpSclX = currentGroupScript.offSclX + Random.Range(currentGroupScript.rndSclMinX, currentGroupScript.rndSclMaxX);
		tmpSclY = currentGroupScript.offSclY + Random.Range(currentGroupScript.rndSclMinY, currentGroupScript.rndSclMaxY);
		tmpSclZ = currentGroupScript.offSclZ + Random.Range(currentGroupScript.rndSclMinZ, currentGroupScript.rndSclMaxZ);
		if(!currentGroupScript.scaleUniform)
		{
			obj.localScale += Vector3(tmpSclX, tmpSclY, tmpSclZ);
		} else
		{
			obj.localScale += Vector3(tmpSclX, tmpSclX, tmpSclX);
		}
		
	}
	
	
	//********************************************************************************************
	//*** Paint
	//********************************************************************************************
	function paint()
	{
	
	if(currentGroupScript.myLibraryBuiltIn.Length == 0 || currentGroupScript.myLibraryBuiltIn[0] == null) return;

		var hit : RaycastHit;
		var ray = HandleUtility.GUIPointToWorldRay(Event.current.mousePosition);
		
        var layerMask = 1 << target.paintLayer;

        if (Physics.Raycast(ray.origin, ray.direction, hit, Mathf.Infinity, layerMask))
		{
			var newObj;
			var myRot;
			var dist = Mathf.Infinity;
			var objToInst;
			//Spray
			if(currentGroupScript.sprayRadius >0)
			{
				var randomCircle = Random.insideUnitCircle * currentGroupScript.sprayRadius;
				var rayDirection = (hit.point + Vector3(randomCircle.x,0,randomCircle.y))  - ray.origin;
				var newHit: RaycastHit;
				if (Physics.Raycast (ray.origin, rayDirection, newHit, Mathf.Infinity, layerMask))
				{
					hit = newHit;
				}
			}
			
			//Check Distance
			if(currentGroup.transform.childCount != 0){
				for(obj in myObjToInstArray)//currentGroup.transform)
				{
					var tempDist = Vector3.Distance(hit.point, obj.transform.position);
					if(tempDist < dist)
						dist = tempDist;
				}
            }

            // See if we are inside of a mask zone.
            // Find all game objects with tag paintMask
            var objectsArray: GameObject[];
            objectMask = false;
            objectsArray = GameObject.FindGameObjectsWithTag("paintMask");
            // Iterate through all objects and check for isInside
            for (var go: GameObject in objectsArray) {
                if (go.GetComponent(Collider)) {
                    if (CheckIsInside(go.GetComponent(Collider), hit.point)) {
                        objectMask = true;
                        //EditorUtility.DisplayDialog("Hit a prefab painting mask!", "It looks like we hit an object with the tag paintMask", "Continue", "You have to continue");
                    }
                }
            }

            var angle: float;
            angle = Vector3.Angle(hit.normal, Vector3(0, 1, 0));

            var hitHeight: float;
            hitHeight = hit.point.y;
            //Debug.Log("Height is: " + hitHeight);
            //Debug.Log("Angle is: " + angle);

            // JO Added check for slop angle and altitude
            if (dist >= currentGroupScript.distanceRadius && angle <= currentGroupScript.maxSlopeVal && angle >= currentGroupScript.minSlopeVal && hitHeight >= currentGroupScript.minAltitudeVal && hitHeight <= currentGroupScript.maxAltitudeVal && !objectMask)
			{
				//Biblio Method
				if(target.bibSortIndex == 0)
				{
					//Random
                    // JO Here is where you would pick an item based on the random probability of each
					var myRandom = Random.Range(0, currentGroupScript.myLibraryBuiltIn.length);
					objToInst = currentGroupScript.myLibraryBuiltIn[parseInt(myRandom)];
				}
				if(target.bibSortIndex == 1)
				{
					objToInst = currentGroupScript.myLibraryBuiltIn[target.bibSoloSelect];
				}
				
				//Check is we're using normal placement
				myRot = Quaternion.identity;
				if(currentGroupScript.useNormal)
				{
					//myRot = Quaternion.LookRotation(hit.normal);
					myRot = Quaternion.FromToRotation(objToInst.transform.up, hit.normal) * objToInst.transform.rotation;
				}
				Undo.RegisterSceneUndo("GeoPainter Paint Add");
				//Create the Object
				//newObj = EditorUtility.InstantiatePrefab(objToInst);
				newObj = PrefabUtility.InstantiatePrefab(objToInst);
				newObj.transform.position = hit.point;
				newObj.transform.rotation = myRot;
				myObjToInstArray.Add(newObj);
				
				//Update Points Array
				currentGroupScript.addObject(newObj,hit.point,newObj.transform.localScale,hit.normal,currentGroupScript.useNormal);
				
				//Update Position Pivot
				if(currentGroup.transform.childCount == 0)
				{
					currentGroup.transform.position = newObj.transform.position;
					newObj.transform.parent = currentGroup.transform;
				} else {
					newObj.transform.parent = currentGroup.transform;
				}
				randomizeSolo(currentGroupScript.myPointsList[currentGroupScript.myPointsList.Count-1]);
				//EditorUtility.ReconnectToLastPrefab(newObj);
				
				
			}
		}
		
	}
	
	//********************************************************************************************
	//*** Paint Remove
	//********************************************************************************************
	function paintRemove()
	{
		Undo.RegisterSceneUndo("GeoPainter Paint Remove");
		var hit : RaycastHit;
		var ray = HandleUtility.GUIPointToWorldRay(Event.current.mousePosition);
		
		if (Physics.Raycast (ray.origin, ray.direction, hit, Mathf.Infinity))
		{
			/*
			//currentGroup
			if(hit.transform.IsChildOf(currentGroup.transform))
			{
				DestroyImmediate(hit.collider.gameObject);
			}
			*/
			for(i=0;i<currentGroupScript.myPointsList.Count;i++)
			{
				var element = currentGroupScript.myPointsList[i];
				if(Vector3.Distance(hit.point,element.go.transform.position) <= currentGroupScript.deleteRadius)
				{
					DestroyImmediate(element.go);
					currentGroupScript.myPointsList.RemoveAt(i);
				}
			}
		}
		
		
		
	}
	
	//********************************************************************************************
	//*** Add a group
	//********************************************************************************************
	function addGroup()
	{
		Undo.RegisterSceneUndo("GeoPainter New Group");
		go = new GameObject ("GeoPainter_Group_" + target.nbrGroupsCreated.ToString());
		target.nbrGroupsCreated = target.nbrGroupsCreated + 1;
		go.AddComponent.<GeoPainterGroup>();
		myGroups.Add(go);
		target.groupSelIndex = myGroups.length;
		currentGroup = myGroups[target.groupSelIndex-1];
		currentGroupScript = currentGroup.GetComponent("GeoPainterGroup");
		myLibrary = new Array(currentGroupScript.myLibraryBuiltIn);
	}
	
	//********************************************************************************************
	//*** Remove a group
	//********************************************************************************************
	function removeGroup(_index,_release)
	{
		Undo.RegisterSceneUndo("Remove Group");
		var index = (_index -1);
		
		if(_release == false)
		{
			var go = myGroups[index];
			DestroyImmediate(go);
		}
		
		myGroups.RemoveAt(index);
		target.groupSelIndex = myGroups.length;
		if(myGroups.length != 0)
		{
			currentGroup = myGroups[target.groupSelIndex-1];
			currentGroupScript = currentGroup.GetComponent("GeoPainterGroup");
			myLibrary = new Array(currentGroupScript.myLibraryBuiltIn);
		} else
		{
			addGroup();
		}
		
	}
	
	//********************************************************************************************
	//*** HANDLES
	//********************************************************************************************
	function drawHandles()
	{
		var hit : RaycastHit;
		var ray = HandleUtility.GUIPointToWorldRay(Event.current.mousePosition);
		var layerMask = 1 << target.paintLayer;
		if (Physics.Raycast (ray.origin, ray.direction, hit, Mathf.Infinity, layerMask))
		{
			if(currentGroupScript.sprayRadius != 0)
			{
                Handles.color = Color.green;
                Handles.CircleHandleCap(1, hit.point, Quaternion.LookRotation(hit.normal), currentGroupScript.sprayRadius, EventType.Repaint);
			}
			if(currentGroupScript.distanceRadius != 0)
			{
				Handles.color = Color.blue;
                Handles.CircleHandleCap(0, hit.point, Quaternion.LookRotation(hit.normal), currentGroupScript.distanceRadius, EventType.Repaint);
			}
			if(currentGroupScript.deleteRadius != 0)
			{
				Handles.color = Color.red;
                Handles.CircleHandleCap(0, hit.point, Quaternion.LookRotation(hit.normal), currentGroupScript.deleteRadius, EventType.Repaint);
            }
            // Draw debug info.
            var e = Event.current;
            var p: Vector3 = new Vector3();
            var c: Camera = UnityEditor.SceneView.lastActiveSceneView.camera;
            var mousePos: Vector2 = new Vector2();
            myStyle = new GUIStyle();
            myStyle.normal.textColor = Color.black;
            myStyle.fontSize = 20;
            if (e.capsLock && drawDebug) {
                // Note that the y position from Event is inverted.
                mousePos.x = e.mousePosition.x + currentGroupScript.deleteRadius;
                mousePos.y = c.pixelHeight - e.mousePosition.y + currentGroupScript.deleteRadius;
                p = c.ScreenToWorldPoint(new Vector3(mousePos.x, mousePos.y, c.nearClipPlane));
                //Handles.Label(p, "Angle: " + Vector3.Angle(hit.normal, Vector3(0, 1, 0)) + " Altitude: " + hit.point.y + " Hit.point: " + hit.point + " Camera Rotation: " + SceneView.lastActiveSceneView.rotation.eulerAngles);
                Handles.Label(p, "Ang: " + Vector3.Angle(hit.normal, Vector3(0, 1, 0)).ToString("0.0"), myStyle);
                mousePos.x = e.mousePosition.x + currentGroupScript.deleteRadius;
                mousePos.y = c.pixelHeight - e.mousePosition.y + currentGroupScript.deleteRadius + 25;
                p = c.ScreenToWorldPoint(new Vector3(mousePos.x, mousePos.y, c.nearClipPlane));
                Handles.Label(p, "Alt: " + hit.point.y.ToString("0.0"), myStyle);
            }
            if (e.control && drawDebug) {
                // Note that the y position from Event is inverted.
                mousePos.x = e.mousePosition.x + currentGroupScript.deleteRadius;
                mousePos.y = c.pixelHeight - e.mousePosition.y + currentGroupScript.deleteRadius;
                p = c.ScreenToWorldPoint(new Vector3(mousePos.x, mousePos.y, c.nearClipPlane));
                Handles.Label(p, "Paint mode", myStyle);
            }
            if (e.shift && drawDebug) {
                // Note that the y position from Event is inverted.
                mousePos.x = e.mousePosition.x + currentGroupScript.deleteRadius;
                mousePos.y = c.pixelHeight - e.mousePosition.y + currentGroupScript.deleteRadius;
                p = c.ScreenToWorldPoint(new Vector3(mousePos.x, mousePos.y, c.nearClipPlane));
                Handles.Label(p, "Clean mode", myStyle);
            }
		}
	}
	
	//********************************************************************************************
	//*** ON SCENE GUI
	//********************************************************************************************
	function OnSceneGUI ()
	{

		
		var ctrlID = GUIUtility.GetControlID (appTitle.GetHashCode (), FocusType.Passive);
		if(isPainting)
		{

		
			var e = Event.current;
			//Handles
            drawHandles();
			if(e.keyCode == KeyCode.D && !e.shift) {
				currentGroupScript.distanceRadius += 0.01 ;
				Repaint();
				HandleUtility.Repaint();
			}
			if (e.keyCode == KeyCode.D && e.shift){
				currentGroupScript.distanceRadius -= 0.01;
				if(currentGroupScript.distanceRadius <=0)
				currentGroupScript.distanceRadius = 0;
				Repaint();
				HandleUtility.Repaint();
			}
			if(e.keyCode == KeyCode.S && !e.shift) {
				currentGroupScript.sprayRadius += 0.01 ;
				Repaint();
				HandleUtility.Repaint();
			}
			if (e.keyCode == KeyCode.S && e.shift){
				currentGroupScript.sprayRadius -= 0.01;
				if(currentGroupScript.sprayRadius <=0)
				currentGroupScript.sprayRadius = 0;
				Repaint();
				HandleUtility.Repaint();
			}
			if(e.keyCode == KeyCode.C && !e.shift) {
				currentGroupScript.deleteRadius += 0.01 ;
				Repaint();
				HandleUtility.Repaint();
			}
			if (e.keyCode == KeyCode.C && e.shift){
				currentGroupScript.deleteRadius -= 0.01;
				if(currentGroupScript.deleteRadius <=0)
				currentGroupScript.deleteRadius = 0;
				Repaint();
				HandleUtility.Repaint();
			}
			
			//Mouse Event
			switch (e.type)
			{
				case EventType.MouseDrag:
				if (e.control) {
					paint();
					e.Use();
				}
				else if(e.shift)
				{
					paintRemove();
					e.Use();
				}
				break;
				case EventType.MouseUp:
				if (e.control) {
					paint();
				//	Undo.RegisterUndo(myObjToInstArray.ToBuiltin(GameObject),"New Paint Object");
					myObjToInstArray = new Array();
					e.Use();
				}
				else if(e.shift)
				{
					paintRemove();
					e.Use();
				}
				break;
				case EventType.Layout:
				HandleUtility.AddDefaultControl (ctrlID);
				break;
				case EventType.MouseMove:
				HandleUtility.Repaint();
				break;
				//if(Event.current.type == EventType.MouseDown && Event.current.button == 0)
			}
		}
		
	}
	//********************************************************************************************
	//*** Menu Item
	//********************************************************************************************
	@MenuItem ("GameObject/Add GeoPainter")
	static function CreateMenu () {
		// Get existing open window or if none, make a new one:
		if(!GameObject.Find("GeoPainterSys"))
		{
			go = new GameObject ("GeoPainterSys");
			go.AddComponent.<GeoPainter>();
			Selection.activeGameObject = go;
			
			
		}
    }

	//********************************************************************************************
	//*** Test if hit point is inside of an object. Only works for convex objects.
    //********************************************************************************************
    static public function CheckIsInside(maskingObject: Collider, point: Vector3): boolean
    {
        var center: Vector3;
        var direction: Vector3;
        var ray: Ray;
        var hitInfo: RaycastHit;
        var hit : boolean;

        // Use collider bounds to get the center of the collider. May be inaccurate
        // for some colliders (i.e. MeshCollider with a 'plane' mesh)
        center = maskingObject.bounds.center;

        // Cast a ray from point to center
        direction = center - point;
        ray = new Ray(point, direction);
        hit = maskingObject.Raycast(ray, hitInfo, direction.magnitude);
        //hit = Physics.Raycast(point, direction, Mathf.Infinity);

        // If we hit the collider, point is outside. So we return !hit
        //Debug.Log("Collision is: " + hit);
        return !hit;
    }

}