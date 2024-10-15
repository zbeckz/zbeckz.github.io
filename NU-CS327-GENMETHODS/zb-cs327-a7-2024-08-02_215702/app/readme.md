# A7: Data Essay

### Your Glitch link

https://zb-cs327-a7.glitch.me

-----------

## Essay reading #1 

### Title, author and link

Title: Introduction to the A* Algorithm\
Author: Red Blob Games\
Link: https://www.redblobgames.com/pathfinding/a-star/introduction.html

### Main argument this essay is making

Explaining how the A* pathfinding algorithm works and can be implemented in a computer programming language

### Outline

1. Text. Introduction to the problem of trying to find the shortest path from one place to another
2. Viz (Canvas). You can choose a starting and ending location within an on screen map, and the shortest path between the two points will appear.
3. Text. Description of the inputs into a graph search algorithm, as well as an explanation of which algorithm(s) will be explored
4. Viz (Canvas). Portrayal of the nodes and edges that make up the input graph to a graph search algorithm. Certain features of the portrayal are highlighted when certain parts of the following paragraph are hovered over
5. Text. Description of the output of a graph search algorithm and some tradeoffs of the data representation
6. Viz (Canvas). Visual representation of the above tradeoffs
7. Text. Pathfinding map versus game map.
8. Text. Basic descriptions for the search algorithms that will be covered
9. Text. Intro to the idea of a frontier in a BFS
10. Viz (Canvas and HTML Controls). Animation of an expanding frontier of a graph search
11. Text. Basic steps for expanding the frontier in a BFS
12. Viz (Canvas and HTML Controls). Step by step animation of expanding frontier
13. Text. Code for the algorithm in python and how to modify it to keep track of paths instead of just locations
14. Viz (Canvas). Representation of the path itself using the above algorithm
15. Text. Early exit principle
16. Viz (Canvas). Visusalizing the difference between early exit and no early exit
17. Text. Movement costs
18. Viz (Canvas). Movement cost differences
19. Text. Heuristic search code.
20. Viz (Canvas). Heuristic search display
21. Text. Dijkstra's search code.
22. Viz (Canvas). Dijkstra's search code.
23. Text. A* Search code.
24. Text. Conclusion

### What worked well in this?

Each next step in building up the principles of A* is visualized. The comprehensive visualizations at each step allow the reader to have a deeper understanding of A* instead of just blindly reading code.


-----------

## Essay reading #2 

### Title, author and link

Title: Parable of the Hill Climber\
Author: Nicky Case\
Link: https://blog.ncase.me/parable-of-the-hill-climber/

### Main argument this essay is making

Comparing a very adult topics of overcoming depression and stochastic gradient descent in the form a children's book style story

### Outline

1. Text. Setting up the story
2. Viz (HTML img). Introduction to what our main character looks like
3. Text. What does our character want to do? Get to the top
4. Viz (HTML img). Showing our character doing this.
5. Text. Character reaches the top
6. Viz (HTML img). Showing the peak
7. Text. Compares what was just done to the hill climbing algorithm
8. Viz (HTML img). Showing the problem with this, only reached a local peak
9. Text. The idea of a local maximum
10. Viz (HTML img). Character is stuck
11. Text. Character doesn't know what to do
12. Viz (HTML img). Still stuck
13. Text. Still doesn't know what to do
14. Viz (HTML img). Character is scared
15. Text. Explains how the algorithm solves getting stuck at a local maximum
16. Viz. Character does what the algorithm does, goes towards a better peak

### What worked well in this?

The simple visualizations lightened up the somber topic and provided a real life example for what otherwise may be a difficult to understand algorithm


-----------

## Essay reading #3

### Title, author and link

Title: The Birthday Paradox Experiment\
Author: Russell Samora\
Link: https://pudding.cool/2018/04/birthday-paradox/

### Main argument this essay is making

An interactive experiment / visualization explaning the birthday paradox in mathematics (odds that two people share a birthday in a room is way higher than you'd think)

### Outline

1. Text. Input your birthday.
2. Viz. Your character walks along a line (representing days of year) to the point that is your birthday
3. Text. Guess how many people you think need to be in the room
4. Text. That gives a very high chance, it is really just 23 people for a 50% chance.
5. Viz. Shows on the line that last 21 who have visited the site.
6. Viz. Do it again and again to show it is 50%
7. Text. Show some math
8. Viz. Show comparing 2 people, 3, etc, until we see that 23 people is 50%

### What worked well in this?

Getting to use real data gathered through the website in the visualization is super cool and really illustrates the concept well. Visually showing the math also allows a deeper understanding than just formulas and numbers

-----------

## Your essay

### What is your essay about?

Baseball statistics

### Where did you get your data? (link or source)

https://www.kaggle.com/datasets/m000sey/major-league-baseball-hitting-data

### Where did this data come from originally? Who collected it?

Shane Simom collected the data from http://www.fangraphs.com/

### What information is in your data? (relevant fields, metadata, etc)

There are 461 rows of data, each representing a player who played in the MLB in 2023 and had 100 or more Plate Appearances. The columns are all baseball hitting statistics, ranging from simple things like games played and home runs to more advanced metrics like wRC+ and xwOBA.


### How many sections do you have?

4



### What technologies and approaches (Vue, P5/canvas, d3, bar graphs, force directed diagrams, emoji, text-coloring, etc) did you use for your visualizations?

I used d3 for the visualizations and vue to re render the visualizations when fields are changed by the user


### Main argument your essay is making

Overview of the types of baseball hitting statistics and how they might be used to evaluate a player

### Outline your essay like you did for the essays you read

1. Text. Introduction to counting statistics
2. Viz. Scatterplot of player's counting statistics with selection input for the x-axis, y-axis, and color of points
3. Text. Introduction to rate statistics
4. Viz. Scatterplot of player's rate statistics with selection input for the x-axis, y-axis, and color of points
5. Text. Introduction to advanced statistics
6. Viz. Scatterplot of player's advanced statistics with selection input for the x-axis, y-axis, and color of points
7. Text. Why might we use all statistics
8. Viz. Scatterplot of all statistics with selection input for the x-axis, y-axis, and color of points

### Which two sections have controls, and what can the user explore with them?

All 4 visualizations have HTML selection inputs that control which fields are plotted on the x axis, y axis, and color of points

### What is one interesting thing you discovered in your data?

It is very interesting in the final visualization to compare expected and actual batting statistics. It reveals which players were lucky and which were unlucky

-----------


### What is one new skill that you gained during this project?

Combining Vue and d3. I'd used both separately but never together.

### Glitch handles of people in class you got help from, and their help, (or help you gave!)

N/A

### Assets you got from online and why you have permission to include them

https://www.kaggle.com/datasets/m000sey/major-league-baseball-hitting-data\
\
This csv file is free on Kaggle

### Online help, including ChatGPT 

I used https://csvjson.com/csv2json to convert the above csv file into a json file for my assignment