document.addEventListener("DOMContentLoaded", (event) => 
{
  console.log("DOM fully loaded and parsed");

  new Vue({
    template: 
    `<div id="app">
    
      <article>
      
        <!-- Title -->
        <section>
          <h1>MLB Batting Metrics</h1>
        </section>
        
        <essay-baseball v-for="(essay, index) in this.specs"
                          :paragraph="essay.paragraph"
                          :stats="essay.stats"
                          :x="essay.x"
                          :y="essay.y"
                          :c="essay.c"
                          :vizID="'viz' + index"
                          :paragraphID="'paragraph' + index">
        </essay-baseball>
      
      </article>
      
      
		</div>`,

    mounted() 
    { 
      
    },

    data() 
    {   
      return {
        specs:
        [
          {
            stats: ["G", "AB", "PA", "HR", "RBI", "H", "1B", "2B", "3B", "R", "BB", "SO", "SB", "CS", "IBB", "HBP", "SF", "SH", "GDP"],
            x: "HR",
            y: "RBI",
            c: "AB",
            paragraph: "<p>Baseball has a large number of batting statistics. Looking at these statistics is how fans, players, coaches, and front office staff evaluate player performance. Some of these stats are known as <strong>counting stats.</strong></p><p>Counting stats are simply stats that measure the amount of times a player did a certain thing throughout the season. An example of counting stats that a player would want to have a high amount in is <em>Home Runs</em> or <em>RBIs</em> (seen below). There are many other counting stats too, and comparing them can reveal surface level trends of player performance.</p> "
          },

          {
            stats: ["AVG", "OBP", "SLG", "OPS", "BB%", "K%", "BB/K", "Pull%", "Cent%", "Oppo%", "Soft%", "Med%", "Hard%"],
            x: "OBP",
            y: "SLG",
            c: "Hard%",
            paragraph: "<p><strong>Rate stats</strong>, on the other hand, take into account how often a player had the opportunity to do something, which leads to a deeper understanding of performance than simple <strong>counting stats</strong></p><p>For example, take a simple counting stat like <em>hits</em>. If player A got 100 hits, and player B got 50 hits, it would seem that player A performed better. But, we can make a <strong>rate stat</strong> using <em>hits</em>. Take <em>hits</em> divided by <em>at bats</em> to get <em>AVG</em>, a <strong>rate stat</strong> which measures what percentage of the time a player gets a hit. If player A had 500 at bats, their <em>AVG</em> would be .200. If player B had 150 at bats, their <em>AVG</em> would be .333. By utilizing a <strong>rate stat</strong>, we can see that player B actually performed better than player A.</p>"
          },

          {
            stats: ["wOBA", "wRC+", "xBA", "xSLG", "xwOBA", "Batting", "Base Running", "Fielding", "WAR"],
            x: "wRC+",
            y: "Fielding",
            c: "WAR",
            paragraph: "<p><strong>Advanced statistics</strong> take player evaluation even deeper. Metrics like <em>wRC+</em> take into account a hitters <strong>rate stats</strong> and normalize them into a number where 100 is always league average. 105 means 5% better than average, 95 means 5% worse. It takes into account what stadiums a player hits in and other factors that contribute to their performance.</p><p>There are also <strong>Advanced statistics</strong> that reflect how well a player is hitting the ball regardless of outcome. These stats are meant to remove any factor of luck that comes with hitting a baseball. Take <em>xBA</em> for example. This takes into account how hard and at what angle a player hits the ball to predict what their batting average would be if there was no luck involved.</p><p>Finally, there are <strong>Advanced statistics</strong> meant to give value to a player based on one aspect of player performance (batting, baserunning, fielding) or a combination of all 3 (WAR). These are cumulative stats, meaning the more a player plays the more these numbers can grow."
          },

          {
            stats: ["G", "AB", "PA", "HR", "RBI", "H", "1B", "2B", "3B", "R", "BB", "SO", "SB", "CS", "IBB", "HBP", "SF", "SH", "GDP", "AVG", "OBP", "SLG", "OPS", "BB%", "K%", "BB/K", "Pull%", "Cent%", "Oppo%", "Soft%", "Med%", "Hard%", "LA", "EV", "wOBA", "wRC+", "xBA", "xSLG", "xwOBA", "Batting", "Base Running", "Fielding", "WAR"],
            x: "xSLG",
            y: "SLG",
            c: "AB",
            paragraph: "<p>Ultimately, looking at <strong>all</strong> stats is the only way to truly evaluate a player. For example, comparing <em>xSLG (expected slugging)</em> to <em>SLG (slugging)</em> can show us which players were seemingly unlucky based on how well they hit the ball. Players who have a higher <em>xSLG</em> than <em>SLG</em> were unlucky, and vice versa.</p><p>Change the axes and color fields below and see if you can find any interesting trends!</p>"
          }
        ]
      }
    },
    
    el: "#app",
  });
});
