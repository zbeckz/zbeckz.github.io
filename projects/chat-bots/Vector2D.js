
// Useful
function objToInlineStyle(styleObj) {
	// FROM GPT
    // Define a mapping of style properties that should use HSL notation
    const hslProperties = ['background-color', 'color', 'border-color'];

    // Initialize the inline style string
    let inlineStyle = '';

    // Loop through the properties in the style object
    for (const property in styleObj) {
        if (styleObj.hasOwnProperty(property)) {
            const value = styleObj[property];

            // Check if the property should use HSL notation
            if (hslProperties.includes(property)) {
                if (Array.isArray(value) && value.length === 3) {
                    // Convert the array to an HSL color string
                    const hslColor = `hsl(${value[0]}, ${value[1]}%, ${value[2]}%)`;
                    inlineStyle += `${property}: ${hslColor}; `;
                }
            } else {
                // Use pixel units for other properties
                inlineStyle += `${property}: ${value}px; `;
            }
        }
    }

    return inlineStyle;
}

class Vector2D {
	static polar(r, theta) {
		return new Vector2D(r*Math.cos(theta), r*Math.sin(theta))
	}

	static sub(pt0, pt1) {
		return new Vector2D(pt0.x - pt1.x, pt0.y - pt1.y)
	}

	static edgePoint(...args) {
		return new Vector2D().setToEdgePoint(...args)
	}

	static distance(v1, v2) {
    if (!(v1 instanceof Vector2D) || !(v2 instanceof Vector2D)) {
      throw new Error('Both parameters should be instances of Vector2D');
    }
    return Math.sqrt((v1.x - v2.x)**2 + (v1.y - v2.y)**2);
  }
 
	constructor(x=0, y=0) {
		this.x = x;
		this.y = y;
	}
	clone() {
		return new Vector2D(this.x, this.y);
	}


  // =========
	// Getters

	get angle() {
		return Math.atan2(this.y, this.x)
	}

	get magnitude() {
		return Math.sqrt(this.x ** 2 + this.y**2)
	}

	getDistanceTo(v) {
		return Math.sqrt((this.x-v.x)**2 + (this.y-v.y)**2)
	}

	getAngleTo(v) {
		return atan2(v.y- this.y, v.x - this.x)
	}

	getNormal() {
		let m = this.magnitude() || 1
		return new Vector2D(this.y/m, -this.x/m)
	}

	getClosest(pts, {getPosition, getRadius, range=20}={}) {
		let closest = undefined;
		let closestDistance = range;
		pts.forEach(pt => {
				let pos = getPosition?getPosition(pt):pt
				const radius = getRadius?getRadius(pt) :pt.radius || 0; // Default radius to 0 if not provided

				// Calculate the distance between the point and the particle
				const distance = Math.sqrt((this.x - pos.x) ** 2 + (this.y - pos.y) ** 2) - radius;

				// Update the closest particle if this particle is closer
				if (distance < closestDistance) {
					closestDistance = distance;
					closest = pt;
				}
			

		})
	
		return closest;
	}
	
	isWithin(x0, y0, x1, y1) {
		return this.x >= x0 && this.x <= x1 && this.y >= y0 && this.y <= y1
	}
	
	// =========
	// Setters


	setTo(...args) {
		if (!isNaN(args[0]) && !isNaN(args[1])) {
					this.x = args[0]
					this.y = args[1]
					return this
		}
		if (typeof args[0] == Object && !isNaN(args[0].x) && !isNaN(args[1].y)) {
				this.x = args[0]
					this.y = args[1]
			return this
		} 
		console.warn("Incorrect args for 'setTo'", args)
		return this
	}

	setToEdgePoint({pt0, pt1, v, pct=0, edgeOffset=0, normalOffset=0}) {
		// Set to a point on the edge, somewhere (pct) between pt0, and pt1, 
		// Or from pt0 along a vector v
		// it may be offset some distance with the normal (n) 
		// it may be offset some distance along the direction of the edge (m) 
		
		// No vector, just use the two endpoints
		if (!v)
			v = new Vector2D( pt1.x - pt0.x, pt1.y - pt0.y)

		let mag = v.magnitude || 1
		

		let ex = v.x/mag
		let ey = v.y/mag

		let nx = ey
		let ny = -ex

		this.x = pt0.x + v.x*pct + nx*normalOffset + ex*edgeOffset
		this.y = pt0.y + v.y*pct + ny*normalOffset + ey*edgeOffset
		return this
	}

	setToPolar(r, theta) {
		this.x = r*Math.cos(theta)
		this.y = r*Math.sin(theta)
		return this
	}

	setToLerp(v0, v1, pct) {
		this.x = v0.x*(1-pct) + v1.x*pct
		this.y = v0.y*(1-pct) + v1.y*pct
		return this
	}

	setToAddMultiple(...args) {
		this.mult(0)
		this.addMultiple(...args)
		return this
	}

	setToMultiple(m, v) {
		this.x = m*v.x
		this.y = m*v.y
		return this
	}

	setToAdd(...args) {
		this.mult(0)
		this.add(...args)

		return this
	}

	setToOffset(pt0, pt1) {
		this.x = pt1.x - pt0.x
		this.y = pt1.y - pt0.y
		return this
	}

	// =========
	// Adders/Multipliers

	constrain(min, max) {
		let m = this.magnitude
		let m2 = Math.min(max, Math.max(min, m))

		// skip if mag 0
		if (m)
			this.mult(m2/m)
		return this
	}

	wrap(x0, y0, x1, y1) {
		// Off right
		if (this.x > x1)
			this.x = x0

		// Off left
		if (this.x < x0)
			this.x = x1

		// Off the bottom
		if (this.y > x1)
			this.y = y0

		// Off the top
		if (this.y < y0)
			this.y = y1
		return this
	}

lerpTo(pt, pct) {
		this.x = (1 - pct)*this.x + pct*pt.x
		this.y = (1 - pct)*this.y + pct*pt.y
		return this
	}

	normalize() {
		let m = this.magnitude || 1
		this.div(m)
		return this
	}

	div(m) {
		this.x /= m
		this.y /= m
		return this
	}


	mult(m) {
		this.x *= m
		this.y *= m
		return this
	}


	addPolar(r, theta) {
		this.x += r*Math.cos(theta)
		this.y += r*Math.sin(theta)
		return this
	}

	addMultiple(...args) {

		// Takes alternating params of Vector2D (or anything with x,y) and scalars

		// Ensure we have an even number of arguments
		if (args.length % 2 !== 0) {
			throw new Error("Expecting an even number of arguments. Pairs of Vector2D (or similar) and scalars are required.");
		}
		
		for (let i = 0; i < args.length/2; i++) {
			// Expecting a Point instance at even indices
			let v = args[i*2]
			let m = args[i*2 + 1]

			 // Check if the vector has x and y properties
			if (typeof v.x !== 'number' || typeof v.y !== 'number') {
				console.warn(v)
				throw new Error(`Expecting an object with x and y properties at index ${i * 2}.`);
			}

			// Check if the scalar is a number
			if (typeof m !== 'number') {

				throw new Error(`Expecting a number at index ${i * 2 + 1}. Got ${typeof m}`);
			}


			this.x += m*v.x;
			this.y += m*v.y;
		} 
		return this
	}


	add(...points) {
		// Takes parameters of Vector2D (or anything with x,y)
		for (const point of points) {
			this.x  += point.x;
			this.y  += point.y;
		}

	
		return this
	}

	sub(...points) {
		// Takes parameters of Vector2D (or anything with x,y)
		for (const point of points) {
			this.x -= point.x;
			this.y -= point.y;
		}

	
		return this
	}

	// =========
	// Draw

	draw(p, radius=10) {
		p.circle(...this, radius)
	}

	drawArrow(p, {v, multiplyLength=1, normalOffset=0,  startOffset=0, endOffset=0, color}) {
		
		// Make points
		let start = Vector2D.edgePoint({pt0:this, v, pct: 0, normalOffset, edgeOffset: startOffset})
		let end = Vector2D.edgePoint({pt0:this, v, pct: multiplyLength, normalOffset, edgeOffset: endOffset})
		
		// Draw the line
		if (color)
			p.stroke(...color)

		p.line(...start, ...end)

		p.noStroke()
		if (color) 
			p.fill(...color)

		// Draw the arrowhead
		p.push()
		p.translate(...end)
		p.rotate(v.angle)
		let d = 10
		let w = 4
		p.quad(0,0, 
			-d, w, 
			-d*.6, 0, 
			-d, -w)
		
		// p.translate(v)
		p.pop()

	}


	// From chatGPT: make it iterable/spreadable
	[Symbol.iterator]() {
		let index = 0;
		const properties = [this.x, this.y];

		return {
			next: () => {
				if (index < properties.length) {
					return { value: properties[index++], done: false };
				} else {
					return { done: true };
				}
			}
		};
	}
}

// Some utility functions

let noise = (() => {
  let noiseFxn = new SimplexNoise(0)
  return function noiseAny() {
    if ( arguments.length == 1)
      return noiseFxn.noise2D(arguments[0],0)
    if ( arguments.length == 2)
      return noiseFxn.noise2D(arguments[0],arguments[1])
    if ( arguments.length == 3)
      return noiseFxn.noise3D(arguments[0],arguments[1],arguments[2])
    if ( arguments.length == 4)
      return noiseFxn.noise4D(arguments[0],arguments[1],arguments[2], arguments[3])
    return 0
  }
})()

function map(x, y0, y1, z0, z1) {
	let pct = (x - y0)/(y1 - y0) 
	return pct*(z1-z0) + z0
}

function findClosestParticle(systems, x, y) {
	let closestParticle = null;
	let closestDistance = 20;

	for (const sys of systems) {
		for (const pt of sys.particles) {
			const radius = pt.radius || 0; // Default radius to 0 if not provided

			// Calculate the distance between the point and the particle
			const distance = Math.sqrt((x - pt.x) ** 2 + (y - pt.y) ** 2) - radius;


			// Update the closest particle if this particle is closer
			if (distance < closestDistance) {
				closestDistance = distance;
				closestParticle = pt;
			}
		}
	}

	return closestParticle;
}
