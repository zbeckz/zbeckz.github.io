# Assignment 7: Data Essay


## Speedrun

* Read/play three interactive essays (things that alternate between text and interactive/visualizations).
	* **For each one, write down an outline of the essay:** a sentence summary of **each** paragraph, **each** visualization step (and what its trying to show) and use the Chrome dev tools to see what the visualization is displayed as.  Is it an image, a canvas, or HTML elements?
	- [Explorable Explanations](https://explorabl.es/) is the biggest collection, with pieces about art, science, math, and music.
	- [Nicky Case](https://explorabl.es/) is my favorite prolific creator of these: Parable of the Polygons, Evolution of Trust, Nervous Neurons, and To Build A Better Ballot are some favorites.
	- You can find many news-related ones on the NYtimes interactive site, especially [The Upshot](https://www.nytimes.com/section/upshot).
	- There are also a few in [Google Experiments](https://experiments.withgoogle.com/), like [Exploring DaVinci's Notebooks](https://artsandculture.google.com/experiment/TAEPZtXK2s139g) and [Seeing Invisible Health Risks](https://artsandculture.google.com/experiment/seeing-the-invisible/_QG_qDtzdqTsww).
	- [Information is Beautiful](https://informationisbeautiful.net/) mostly has standalone visualizations, which are good for inspiration, but a few multi-part ones, like [a very complex infographic about Buddhism](https://informationisbeautiful.net/visualizations/buddhism-explained-key-beliefs-samsara-nirvana-dependent-origination-enlightenment-jhanas/).
	- Reddit [/dataisbeautiful](https://www.reddit.com/r/dataisbeautiful/) always has new visualization posts.
	- There are many more around the web, like [two different Hamilton visualizations](https://graphics.wsj.com/hamilton/) from The Wall Street Journal and [Pudding's Hamilton visualizations](https://pudding.cool/2017/03/hamilton/).
	- Find some good ones? Share them under the Discord Useful Stuff Channel!
* Get a data source:
	* **Easy**: find a small (<5Mb) json dataset on [Kaggle](https://www.kaggle.com/) or [Corpora](https://github.com/dariusk/corpora) (you can convert CSV to JSON with [online tools](https://csvjson.com/csv2json))
	* **Harder**: 
	* To use larger data, use Flask to serve a RESTful API that can run continuously and only load the data once, no matter how many users visit
	* you don't want the user to download 200Mb each time they refresh the pages 
	* Use an API to get data - [a list of APIs](https://github.com/public-apis/public-apis)
		*  	you want one that either has no key (easy) 
		*   or an API key (harder, have to use Flask to store the key, or leave it open on your site for risky low-security)
	*   **Found good datasets? Share them!**
*   Create an essay in a Vue instance.  Make sections with an explanatory paragraph (or two) and some kind of visualizations. (ie, you will end up with at least 3 paragraphs and 3 visualizations, but feel free to write more to tell the story!)
	*   Your visualizations may use Vue (good for colored text or divs, bar graphs made of emoji, eg) or P5 with any of our techniques.  You can also try D3, though it does not always play well with Vue.
	*   At least two of your sections should have interactive controls
  * They can be different visualizations of the same data, or the same visualizations with different settings
	*   Have 3-7 of these vis+explanations sections.  (ie, three paragraphs + three visualizations, etc)
	*   **Try to tell an interesting story with your data!**
*   Give your essay a visual style that works with it
 
**Note:** Find a dataset that has interesting structured data, not just a list of strings.  Data that is easier to visualize may have things like numerical fields, geographic location data, or colors (there are MANY good color datasets on Kaggle). The [Quickdraw Dataset](https://quickdraw.withgoogle.com/data) has curve positions that can be drawn with P5 (ie, visualize all the cats) but is too big and has to be preprocesed with JSON. I also have a collection of [proprocessed word data](https://github.com/galaxykate/KatesComboWords).

## Rubric

*  3pts: has visualizatios
*  3pts: has paragraphs
*  1pts: two are controllable
*  2pts: have readme.md filled out
*  1pts: GIF (or screenshots) submitted to Canvas


