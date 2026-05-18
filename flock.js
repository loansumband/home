let flock;
let food;
let scale = 1;

let search = "gggg"
let names = ["kat", "nicholas", "dan", "kairos", "neil", "anonymous fish"]

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, document.getElementsByTagName("canvas")[0]);
  // pixelDensity(0.5)
  flock = new Flock();
  noiseSeed(1);


  // Add an initial set of boids into the system
  for (let i = 0; i < 100; i++) {
    let n = names[i]
    if (i >= names.length){
      n = names[names.length - 1] + i
    }
    let b = new Boid(random(0, width), random(0, height), n);
    flock.addBoid(b);
  }

}

function draw() {
	clear()
	background(0,0,0,0);
	flock.run();
}

// On mouse drag, add a new boid to the flock
function mouseDragged() {
	// food.addFood(new Food(mouseX, mouseY));
}

document.getElementById("search").addEventListener("change", (e)=>{
	search = e.target.value
})

// Flock class to manage the array of all the boids
class Flock {
  constructor() {
    // Initialize the array of boids
    this.boids = [];
  }

  run() {
    for (let boid of this.boids) {
      // Pass the entire list of boids to each boid individually
      boid.run(this.boids);
    }
  }

  addBoid(b) {
    this.boids.push(b);
  }
}

function drawFish(currhash, size, position, theta){
  let a = createVector(0.3+ noise(currhash - 600)/10 - 0.1, 0.8 + noise(currhash + 600)/2 - 0.5) // head size
  let b = createVector(0.6 + noise(currhash - 100)/2 - 0.5, 0.5 + noise(currhash + 100)/2 - 0.5) 
  let c = createVector(1 + noise(currhash - 400)/2 - 0.5, 1.1 + noise(currhash + 400) - 0.5) // fin width
  let d = createVector(0.9 + noise(currhash - 200) - 0.5, 1.6 +  noise(currhash + 200) - 0.5) // fin
  let e = createVector(0.36, 1.3)
  let f = createVector(noise(currhash - 100)/4, 2) // tail connect
  let g = createVector(0.33, 2.4 + noise(currhash - 1000)/2 - 0.25) 
  let h = createVector(0, 2.3 + noise(currhash - 200)/2 - 0.25)// tail split
  let j = createVector(1.05 - noise(currhash + 9000)/10, 1.4 - noise(currhash + 9000)*0.8)
  push();
    translate(position.x,position.y);
    rotate(theta);
  
    beginShape();
    vertex(0, -size);
    vertex(-size * a.x * j.x, -size * a.y * j.y)
    vertex(-size * b.x * j.x, -size * b.y * j.y);
  
    vertex(-size/2, size/2);
  
    vertex(-size * c.x * j.x, size * c.y * j.y)
    vertex(-size * d.x * j.x, size * d.y * j.y)
    vertex(-size * e.x * j.x, size * e.y * j.y);
    vertex(-size * f.x * j.x, size * f.y * j.y);
  
    vertex(-size * g.x * j.x, size * g.y * j.y);
    vertex(size * h.x * j.x, size * h.y * j.y);
    vertex(size * g.x * j.x, size * g.y * j.y);
  
    vertex(size * f.x * j.x, size * f.y * j.y);
    vertex(size * e.x * j.x, size * e.y * j.y);
    vertex(size * d.x * j.x, size * d.y * j.y)
    vertex(size * c.x * j.x, size * c.y * j.y)
  
    vertex(size/2, size/2);
  
    vertex(size * b.x * j.x,-size * b.y * j.y);
    vertex(size * a.x * j.x, -size * a.y * j.y)
    vertex(0, -size);
    endShape(CLOSE);
    
    strokeWeight(0);
    fill(noise(currhash + 1)*255, noise(2000 * currhash + 1)*255, noise(1000* currhash + 1)*255);
    beginShape();
    vertex(-size/2, size/2);
    vertex(-size * c.x * j.x, size * c.y * j.y)
    vertex(size * c.x * j.x, size * c.y * j.y)
    vertex(size/2, size/2);
    endShape(CLOSE);
  
    beginShape();
    vertex(-size * a.x * j.x, -size * a.y * j.y)
    vertex(-size * b.x * j.x, -size * b.y * j.y);
  
    vertex(size * b.x * j.x,-size * b.y * j.y);
    vertex(size * a.x * j.x, -size * a.y * j.y)
    endShape(CLOSE);
  
    beginShape();
    vertex(-size * f.x * j.x, size * f.y * j.y);
    vertex(-size * g.x * j.x, size * g.y * j.y);
    vertex(size * h.x * j.x, size * h.y * j.y);
    vertex(size * g.x * j.x, size * g.y * j.y);
    vertex(size * f.x * j.x, size * f.y * j.y);
    endShape(CLOSE);
  pop()
}

function newhash(name){
  let hash = TWO_PI;
  for(let i = 0; i < name.length; i++){

    hash = hash + name.charCodeAt(i)
    hash = hash * name.charCodeAt(i)
    while (hash > 1000000000000){
      hash = hash / 10
    }
  }
  return round(hash)
}


class Boid {
  constructor(x, y, name) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.position = createVector(x, y);
    this.size = 6.0 * scale;
	  this.name = name
    this.hash = newhash(name)

    // Maximum speed
    this.maxSpeed = 3  * scale;

    // Maximum steering force
    this.maxForce = 0.05  / scale;
    colorMode(HSB);
    randomSeed(this.hash)
    lightness = random(256)
    randomSeed(this.hash + 1000)
    this.color = color(random(256), 255, lightness);
  }

  run(boids) {
    this.flock(boids);
    this.update();
    this.borders();
    this.render();
  }

  applyForce(force) {
    // We could add mass here if we want: A = F / M
    this.acceleration.add(force);
  }

  // We accumulate a new acceleration each time based on three rules
  flock(boids) {
    let separation = this.separate(boids);
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);

    // Arbitrarily weight these forces
    separation.mult(1.5);
    alignment.mult(1.0);
    cohesion.mult(1.0);

    
    // consciousness .... 
    if(noise(this.hash + Date.now() / 1000) < 0.3){
      return
    }
    // Add the force vectors to acceleration
    this.applyForce(separation);
    this.applyForce(alignment);
    this.applyForce(cohesion);
  }

  // Method to update location
  update() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
	
    // Reset acceleration to 0 each cycle
    this.acceleration.mult(0);
  }

  // A method that calculates and applies a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  seek(target) {
	let maxForce = this.maxForce
	if(mouseIsPressed){
		target = createVector(mouseX, mouseY)
	 	maxForce = this.maxForce * 2
	}
    // A vector pointing from the location to the target
    let desired = p5.Vector.sub(target, this.position);

    // Normalize desired and scale to maximum speed
    desired.normalize();
	let maxSpeed = this.maxSpeed * noise(this.hash  + Date.now() / 1000)
    desired.mult(maxSpeed);

    // Steering = Desired minus Velocity
    let steer = p5.Vector.sub(desired, this.velocity);

    // Limit to maximum steering force
    steer.limit(maxForce);
    return steer;
  }

  render() {
    // Draw a triangle rotated in the direction of velocity
    let theta = this.velocity.heading() + radians(90) + radians(10) * Math.sin((1 + this.velocity.mag() / 6) * Date.now() / 50 / scale);
    fill(this.color);
    stroke(255);

    drawFish(this.hash, this.size, this.position, theta)
    // push();
	
    // translate(this.position.x, this.position.y);
    // rotate(theta);

    // beginShape();
    // vertex(0, -this.size);
    // vertex(-this.size * 0.25, -this.size * 0.6)
    // vertex(-this.size * 0.3,-this.size * 0.5);

    // vertex(-this.size/2, this.size/2);
    
    // vertex(-this.size * 0.5, 1.1 * this.size)
    // vertex(-this.size * 0.7, 1.6 * this.size)
    // vertex(-this.size * 0.36, 1.3 * this.size);
    // vertex(0, 2 * this.size);
    
    // vertex(-this.size/3, 2.4 * this.size);
    // vertex(this.size/3, 2.4 * this.size);
    
    // vertex(0, 2 * this.size);
    
    // vertex(this.size * 0.36, 1.3 * this.size);
    // vertex(this.size * 0.7, 1.6 * this.size)
    // vertex(this.size * 0.5, 1.1 * this.size)
    
    // vertex(this.size/2, this.size/2);
    
    // vertex(this.size * 0.3,-this.size * 0.5);
    // vertex(this.size * 0.25, -this.size * 0.6)
    // vertex(0, -this.size);

    // endShape(CLOSE);
    // pop();
	if (createVector(mouseX, mouseY).dist(this.position) < 50 || this.name.toLowerCase().includes(search.toLowerCase())){
		text(this.name, this.position.x, this.position.y)
	}

  }

  // Wraparound
  borders() {
    if (this.position.x < -this.size) {
      this.position.x = width + this.size;
    }

    if (this.position.y < -this.size) {
      this.position.y = height + this.size;
    }

    if (this.position.x > width + this.size) {
      this.position.x = -this.size;
    }

    if (this.position.y > height + this.size) {
      this.position.y = -this.size;
    }
  }

  // Separation
  // Method checks for nearby boids and steers away
  separate(boids) {
    let desiredSeparation = 30.0;
    let steer = createVector(0, 0);
    let count = 0;

    // For every boid in the system, check if it's too close
    for (let boid of boids) {
      let distanceToNeighbor = p5.Vector.dist(this.position, boid.position);

      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if (distanceToNeighbor > 0 && distanceToNeighbor < desiredSeparation) {
        // Calculate vector pointing away from neighbor
        let diff = p5.Vector.sub(this.position, boid.position);
        diff.normalize();

        // Scale by distance
        diff.div(distanceToNeighbor);
        steer.add(diff);

        // Keep track of how many
        count++;
      }
    }

    // Average -- divide by how many
    if (count > 0) {
      steer.div(count);
    }

    // As long as the vector is greater than 0
    if (steer.mag() > 0) {
      // Implement Reynolds: Steering = Desired - Velocity
      steer.normalize();
      steer.mult(this.maxSpeed);
      steer.sub(this.velocity);
      steer.limit(this.maxForce);
    }
    return steer;
  }

  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  align(boids) {
    let neighborDistance = 50;
    let sum = createVector(0, 0);
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position, boids[i].position);
      if (d > 0 && d < neighborDistance) {
        sum.add(boids[i].velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxSpeed);
      let steer = p5.Vector.sub(sum, this.velocity);
      steer.limit(this.maxForce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }

  // Cohesion
  // For the average location (i.e., center) of all nearby boids, calculate steering vector towards that location
  cohesion(boids) {
    let neighborDistance = 50;
    let sum = createVector(0, 0); // Start with empty vector to accumulate all locations
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position, boids[i].position);
      if (d > 0 && d < neighborDistance) {
        sum.add(boids[i].position); // Add location
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seek(sum); // Steer towards the location
    } else {
      return createVector(0, 0);
    }
  }
} // class Boid