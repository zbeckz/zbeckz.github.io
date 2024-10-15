// When the webpage loads:
window.onload = function()
{
    new Vue
    ({
        // which element the vue controls
        el: "#app",

        // the html of the element
        template: 
        `
            <div id="app">
                <h3 id=dayCounter>Day {{day}}</h3>
                <table id="table">
                    <tr>
                        <td>Money 💰:</td>
                        <td>\${{money}}</td>
                    </tr>  
                    <tr>
                        <td>Dogs 🐕:</td>
                        <td>{{dogs}}</td>
                    </tr>
                    <tr>
                        <td>Food 🥩:</td>
                        <td>{{food}}</td>
                    </tr>  
                    <tr>
                        <td>Viewers 👀:</td>
                        <td>{{viewership}}</td>
                    </tr>    
                </table>
                <button @click="buyDog" type="button">Rescue Dog from Shelter (-\${{dogPrice}}) </button>
                <button @click="buyFood" type="button">Buy Food (-\${{foodPrice}}) </button>
                <br>
                <button @click="upgradeCamera" type="button" :hidden="cameraLevel > 9" :disabled="dogs < 1">Upgrade Camera to Level {{cameraLevel + 1}} (-\${{cameraPrice}})</button>
                <button @click="storeMembership" type="button" :disabled="storeMember">Purchase Pet Store Membership (-$200)</button>
                <button @click="shelterMembership" type="button" :disabled="shelterMember">Purchase Shelter Membership (-$200)</button>
                <div id="eventLog">
                    <div class="event" v-for="event in events.slice().reverse()">
                        {{event}}
                    </div>
                </div>
            </div>
        `,

        data()
        {
            return {
                day: 1,
                money: 100,
                dogs: 0,
                food: 0,
                cameraLevel: 1,
                streamerLevel: 1,
                storeMember: false,
                shelterMember: false,
                events: [
                    "------------------------------------------------------------------------------------------------------------------------------",
                    "I'd recommend getting a dog first and then some food to get started, good luck!",
                    "But taking care of the dogs is your first priority - if you have no food they will be hungry (and you will have no viewers...)",
                    "This is very important - the amount of money you earn each day depends on how many viewers you have",
                    "The amount of viewers you have is determined by how many dogs you have and how good your camera is",
                    "Congratulations, you've opened a puppy palace where you livestream your dogs!",
                    "------------------------------------------------------------------------------------------------------------------------------"    
                ],
            }
        },

        mounted()
        {
            setInterval(() => this.tick(), 1000)
        },

        methods: 
        {
            tick()
            {
                this.day++;
                
                this.food -= this.dogs;
                if (this.food < 0)
                {
                    this.food = 0;
                }

                if (this.day % 365 == 0 && this.dogs > 10)
                {
                    this.events.push("🏅 Congratulations! You won streamer of the year! +$500 🏅");
                    this.money += 500;
                }
                
                if (this.money > 500 && Math.random() < 0.05)
                {
                    this.events.push("🚑 Oh no! One of your doggies had to make an emergency vet visit after swallowing a toy. -$500 🚑")
                    this.money -= 500;
                }

                if (this.money > 100 && Math.random() < 0.05)
                {
                    this.events.push("⚙ Technical difficulties! Your camera needed repairs. -$100 ⚙")
                    this.money -= 100;
                }

                if (this.viewership > 0 && Math.random() < 0.05)
                {
                    let amount = Math.ceil(Math.random() * 100);
                    this.events.push(`🤑 Somebody donated to your stream! +$${amount} 🤑`);
                    this.money += amount;
                }

                this.money += this.viewership;
            },

            upgradeCamera()
            {
                if (this.money >= this.cameraPrice)
                {
                    this.money -= this.cameraPrice;
                    this.cameraLevel++;
                    this.events.push(`📸 You upgraded your camera to level ${this.cameraLevel}! 📸`)
                    if (this.cameraLevel == 10)
                    {
                        this.events.push("🏆 You have upgraded your camera to the highest capacity!! 🏆")
                    }
                }
            },

            buyDog()
            {
                if (this.money >= this.dogPrice)
                {
                    this.dogs++;
                    this.money -= this.dogPrice;
                }
            },

            buyFood()
            {
                if (this.money >= this.foodPrice)
                {
                    this.food += this.dogs;
                    this.money -= this.foodPrice;
                }
            },

            storeMembership()
            {
                if (this.money >= 200)
                {
                    this.money -= 200;
                    this.storeMember = true;
                    this.events.push("🛒 You purchased a store membership, food can now be bought at a discounted price! 🛒")
                }
            },

            shelterMembership()
            {
                if (this.money >= 200)
                {
                    this.money -= 200;
                    this.shelterMember = true;
                    this.events.push("🐶 You purchased a shelter membership, dogs can now be rescued at a discounted price! 🐶")
                }
            }
        },

        computed:
        {
            viewership()
            {
                if (this.food == 0) { return 0; }
                return Math.ceil((this.dogs**1.1) * 5 * this.cameraLevel);
            },

            cameraPrice()
            {
                return (10 ** (this.cameraLevel+1)) * 2;
            },

            foodPrice()
            {
                if (this.storeMember)
                {
                    return Math.ceil(this.dogs / 2);
                }
                else
                {
                    return this.dogs;
                }
            },

            dogPrice()
            {
                if (this.shelterMember)
                {
                    return 20;
                }
                else
                {
                    return 50;
                }
            }
        },
        
        watch: 
        {
            viewership(newVal, oldVal)
            {
                if (oldVal != 0 && newVal >= 10**(this.streamerLevel+1))
                {
                    this.streamerLevel++;
                    this.events.push(`🤠 Congratulations, you've reached streamer level ${this.streamerLevel}! 🤠`)
                }
            }
        }
    })
}