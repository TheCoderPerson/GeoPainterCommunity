# GeoPainterCommunity
GeoPainter Community Edition is a Unity editor tool for painting prefabs in a scene.

It was originally a paid tool on the Unity Asset Store but at some point was made free by the author:
https://www.assetstore.unity3d.com/en/#!/content/2389

You can watch an older video of the original tools functionality:
https://www.youtube.com/watch?v=pUBOQrjxHjk

I tried it out and decided to make some improvements to it. I asked the original author if I could post it on Github so others could contribute to the tools development and he agreed.

I am keeping the original name but dubbing it the community edition.

Some of the current improvements that I have made are the following:
- Min/Max slope limits for painting prefabs.
- Min/Max altitude limits for painting prefabs.
- Ability to use a mask object for preventing painting in those areas. Objects with the tab "paintMask" will fufill that function.
- Updated some deprecated api calls.
- Added a confirm on delete so the user does not accidently delete painted prefabs.
- Added debug information. When in paint mode press on the CAPS LOCK key to display slope and altitude info for the point you are looking at. Helpful for knowing what to set min/max values for slope/altitude.
- Added debug information to display what mode you are in i.e. paint, or clean when pressing the shift or control key.
- Added checkbox to toggle on/off debug info.
- Added the ability to save brush info per object group.
- Added ability to save min/max slope/altitude info per object group.

Some features I would like to add in the future:
- Convert from unity script to C# since unity script is no longer supported.
- Add ability to have probabilities for each object in an object group. So you could set an object to occur 2% of the time and other objects 20% of the time. Then when painting it would draw the 2% object less frequently then the others. Currently all objects in a group have equal probability of being drawn.
- Clean up the display of the UI (width, presentation, etc.).
- Add better documentation/videos to help explain how to use the tool.
