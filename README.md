# uTrack

This is an activity tracker web app that allows users to record information about their daily activities and see the recorded data in a dashboard. 

I coded this for the purposes of demonstrating what I would do if I were to create a webapp from scratch in a limited amount of time.


## Decisions that were made before and during the process
- __Bootstrap.__ It was the easiest thing to set up to make the website responsive.
- __Single page app.__ I felt that it was good practice to have one single page and have Javascript handle all the transitions and loading data. From a networks perspective, if this was a live page, not having to fetch new HTML everytime something is clicked helps to reduce the load time. From a UI perspective, it forced me to create good UI. From my perspective as a person who browses a lot of websites, a lot of existing website UI is terrible, but using these websites are tolerable because Internet browsers come with a backward and forward button. Not being able to use those two buttons forced me to think, "How can I enable the user to go back to the page he was on? How can I do this while not overly crowding the page?"
- __Underscore.js.__ This is the fastest and most reliable library when working with large arrays. This is really helpful for this project, especially when the user is allowed to add in a large amount of datapoints, so quick calculation is needed.
- __No Jquery.__ I chose not to use Jquery because although it would make programming a lot easier, if this was a live website this would be an additional library to load, thus increasing the load time.
- __No ReactJS.__ I chose not to use ReactJS for the simplicity of this project. React often comes with a lot of boiler plate code, and since there was a time constraint - I wasn't sure if it was worth it to spend a lot of time configuring it.


## Architecture of the files

- __architecture: MVC__
	- __Model__ is defined in *model.js*. there are two models defined in this file: *dataModel* and *graphModel*. *dataModel* keeps track of the data points inserted into the graph so far, *graphModel* keeps track of which table/graph is currently being displayed. Both models have a list of listeners, so whenever data is updated, all the listeners are notified. Let's say example, in a future update, you want fireworks to go off whenever the user adds in an activity that took more than 2 hours. This can be easily added in through this design.
	- __View__ is defined in a single html file. All the view files are in the HTML folder, which only has one file.
	- __Controller__ is defined in *controller.js*. All of the button clicks are handled by eventHandlers. All of this is binded in *utrack.js*.
- When the website is loaded, it loads the data from windows.localStorage after the 'load' event flag. Whenever a data point is added or removed, it updates the locally stored version of the data and calls all the functions in both of the model's listenerList. If this were a live website, this can easily be replaced with GET or POST calls.
- The code for the model and data is written in such a way that none of the variables are exposed, aside from constants like font choices or font color.
- The canvases are all re-rendered once a data point is inserted or deleted. The controller changes the display style according to which graph is being shown.


## Things to improve for next time
- I would make the model creation code follow a singleton pattern. There shouldn't ever be more than one dataModel and graphModel for the page.
- Instead of using canvas, I would have prefered to use the __d3.js__ library to draw graphs. d3.js draws graphs using SVG's, but unfortunately I would also need to use special CSS tricks to make the SVG's responsive to the page size, which I could not figure out.
- I would have opted out of bootstrap and defined my own CSS if this was more of a serious project. I like to have more control over the styling code.


## Icing on the cake

I made a desktop version of the uTrack app using Electron. To see this in action, first run `npm install` on the root directory.

After the packages are installed, run 

```
./node_modules/.bin/electron .
```

on cmd to start Electron. This is the command for Windows. Not sure if the same command also works on Mac.
