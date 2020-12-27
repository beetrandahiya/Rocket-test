

// module aliases
var Engine = Matter.Engine,
    Events = Matter.Events,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Vector = Matter.Vector;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.getElementById('renderport'),
    engine: engine,
    options: {
        width: 350,
        height: 500,
        wireframes: false,

        background: '#a5e5ff'
    }
});

var wall2 = Bodies.rectangle(150, 500, 400, 20, {
    isStatic: true,
    render: {
        fillStyle: '#777777',
        strokeStyle: '#777777',
        lineWidth: 3
    }
});
World.add(engine.world, [wall2]);



// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);



function project()

{
    // document.getElementById('renderport').style.padding = "10px";
document.getElementById('ftr').style.position = 'relative';


    rtime = 7;
    rdtime = rtime * 10;
    rtime = rtime * 1000;

    //rocket constants

    Pexh = 2; //atm
    Patm = 1; //atm
    Aexh = 1; //m^2
    Mi = 3; //kg
    Mp = 3; //kg
    Mf = 3; //kg
    dm_dt = 1 // kg/sec



    Fexh = (Pexh - Patm) * Aexh;



    var rocket = Bodies.rectangle(150, 470, 10, 40, {
        isStatic: false,
    render: { 
        sprite:{ 
            texture: "rocket_sim_model_final_rsz.png"
        }
    }
    });



    velocityarr = [];
    heightarr=[];
    // add all of the bodies to the world
    World.add(engine.world, [rocket]);

    // start loop




    var changeforce = setInterval(function () {
        if (Mf > 0) {
            dmdtms = dm_dt / 100;

            Mf = Mf - dmdtms;

            Mnet = Mi + Mp + Mf;
            Matter.Body.setMass(rocket, Mnet);

            Fnet = Fexh / 100;
        } else if (Mf < 0) {
            Mf = 0;

            Fnet = 0;
        };


    }, 10);

   Matter.Events.on(engine, 'beforeUpdate', function (event) {
        Body.applyForce(rocket, {
            x: rocket.position.x,
            y: rocket.position.y+20
        }, {
            x: 0,
            y: -Fnet
        });

    }); 

    // To start the loop
    var mainLoopId = setInterval(function () {
        //   vx = rocket.velocity.x;
        vy = rocket.velocity.y;
        vy = -vy;
        //   v = (vx) * (vx) + (vy) * (vy);
        //   v = Math.sqrt(v);
        //   v = v.toFixed(4);
        velocityarr.push(vy);
        //  document.getElementById("velocityrealval").innerHTML=velocityarr;

    }, 100);

    // To stop the loop
    setTimeout(function () {
        clearInterval(mainLoopId);
    }, rtime);



    
    // To start the loop
    var mainLoopId = setInterval(function () {
        
        h = rocket.position.y;
        h = 470 - h ;
        heightarr.push(h);

    }, 100);

    // To stop the loop
    setTimeout(function () {
        clearInterval(mainLoopId);
    }, rtime);

    //add graph using chart.js 
    var timei = []
    for (let i = 0; i < rdtime; i++) {
        let ii = i * 0.1
        ii = ii.toFixed(2)
        timei.push(ii)

    }


    setTimeout(function () {

        var ctx = document.getElementById('myChart').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
                labels: timei,
                datasets: [{
                    label: 'Velocity of the rocket',
                    backgroundColor: 'rgba(255, 99, 132,0.5)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: velocityarr
                }]
            },

            // Configuration options go here
            options: {}

        });
    }, rtime)



    //heigh graph
    setTimeout(function () {

        var ctx = document.getElementById('myChart2').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
                labels: timei,
                datasets: [{
                    label: 'height of the rocket',
                    backgroundColor: 'rgba(57, 255, 20,0.5)',
                    borderColor: 'rgb(57, 255, 20)',
                    data: heightarr
                }]
            },

            // Configuration options go here
            options: {}

        });
    }, rtime);




 //plotly graph
  //plotly graph
    /*
  var x=0;
    
  function getData() {
      hplt = rocket.position.y;
  hplt = 470 - hplt ;
      return hplt;

  }

  Plotly.plot('chartplotly', [{
      y: [getData()],
      type: 'line'
  }]);


  setInterval(function () {
      Plotly.extendTraces('chartplotly',{y:[[getData()]]},[0]);

  }, 100); */

    //add trail

/*

    var trail = [];

    Events.on(render, 'afterRender', function () {
        trail.unshift({
            position: Vector.clone(rocket.position),
            speed: rocket.speed
        });

        Render.startViewTransform(render);
        render.context.globalAlpha = 0.7;

        for (var i = 0; i < trail.length; i += 1) {
            var point = trail[i].position,
                speed = trail[i].speed;

            var hue = 250 + Math.round((1 - Math.min(1, speed / 10)) * 170);
            render.context.fillStyle = 'hsl(' + hue + ', 100%, 55%)';
            render.context.fillRect(point.x, point.y, 2, 2);
        }

        render.context.globalAlpha = 1;
        Render.endViewTransform(render);

        if (trail.length > 2000) {
            trail.pop();
        }
    });
*/


//rocketflame
    var trailflame = [];

    Events.on(render, 'afterRender', function () {
        if(Mf>0){
        trailflame.unshift({
            position: {x: rocket.position.x+2,
                y: rocket.position.y+20},
            speed: rocket.speed
        });

        Render.startViewTransform(render);
        render.context.globalAlpha = 0.7;

        for (var i = 0; i < trailflame.length; i += 1) {
            var point = trailflame[i].position,
                speed = trailflame[i].speed;

            var hue = 250 + Math.round((1 - Math.min(1, speed / 10)) * 170);
            render.context.fillStyle = 'hsl(' + hue + ', 100%, 55%)';
            render.context.fillRect(point.x, point.y, 2, 2);
        }

        render.context.globalAlpha = 1;
        Render.endViewTransform(render);

        if (trailflame.length > 10) {
            trailflame.pop();
        }
    }
    });

    //rocketflame2
    var trailflame2 = [];

    Events.on(render, 'afterRender', function () {

        if(Mf>0){
        trailflame2.unshift({
            position: {x: rocket.position.x-2,
                y: rocket.position.y+20},
            speed: rocket.speed
        });

        Render.startViewTransform(render);
        render.context.globalAlpha = 0.7;

        for (var i = 0; i < trailflame2.length; i += 1) {
            var point = trailflame2[i].position,
                speed = trailflame2[i].speed;

            var hue = 250 + Math.round((1 - Math.min(1, speed / 10)) * 170);
            render.context.fillStyle = 'hsl(' + hue + ', 100%, 55%)';
            render.context.fillRect(point.x, point.y, 2, 2);
        }

        render.context.globalAlpha = 1;
        Render.endViewTransform(render);

        if (trailflame2.length > 10) {
            trailflame2.pop();
        }

    }
    });

    //rocketflame3
    var trailflame3 = [];

    Events.on(render, 'afterRender', function () {

        if(Mf>0){
        trailflame3.unshift({
            position: {x: rocket.position.x,
                y: rocket.position.y+20},
            speed: rocket.speed
        });

        Render.startViewTransform(render);
        render.context.globalAlpha = 0.7;

        for (var i = 0; i < trailflame3.length; i += 1) {
            var point = trailflame3[i].position,
                speed = trailflame3[i].speed;

            var hue = 250 + Math.round((1 - Math.min(1, speed / 10)) * 170);
            render.context.fillStyle = 'hsl(' + hue + ', 100%, 55%)';
            render.context.fillRect(point.x, point.y, 2, 2);
        }

        render.context.globalAlpha = 1;
        Render.endViewTransform(render);

        if (trailflame3.length > 10) {
            trailflame3.pop();
        }

    }
    });

    
}