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


    //rocket variables

    Pexh = parseInt(document.getElementById("pressureexh").value);; //atm
    Patm = 1; //atm
    Aexh = parseInt(document.getElementById("areaexh").value);; //m^2
    Mi = parseInt(document.getElementById("massi").value); //kg
    Mp = parseInt(document.getElementById("massp").value);; //kg
    Mf = parseInt(document.getElementById("massf").value);; //kg
    dm_dt = parseInt(document.getElementById("dmdt").value); // kg/sec



    Fexh = (Pexh - Patm) * Aexh;



    var rocket = Bodies.rectangle(150, 470, 10, 40, {
        isStatic: false,
        render: {
            sprite: {
                texture: "rocket_sim_model_final_rsz.png"
            }
        }
    });



    velocityarr = [];
    heightarr = [];
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
                    y: rocket.position.y + 20
                }, {
                    x: 0,
                    y: -Fnet
                });

            });

            Fnet = 0;
        };


    }, 10);

    Matter.Events.on(engine, 'beforeUpdate', function (event) {
        Body.applyForce(rocket, {
            x: rocket.position.x,
            y: rocket.position.y + 20
        }, {
            x: 0,
            y: -Fnet
        });

    });



    //plotly graph

    //plotly graph    //velocity


    function getDatav() {
        vy = rocket.velocity.y;
        vy = -vy;

        return vy;

    }

    var layoutv = {
        title: 'Velocity',
        transition: {
            duration: 100,
            easing: 'exp-out'
        }
    };

    Plotly.plot('chartplotlyv', [{
        y: [getDatav()],
        type: 'line',
        marker:{
            size:5
        },
        line:{
            color:'rgba(199,36,177,0.7)',
            width:3
        },
        fill:'tonexty',
        fillcolor:'rgba(199,36,177,0.05)'
    }],layoutv, {
        displayModeBar: false
    });

    stpgrp = 0;

    var plotupdtv = setInterval(function () {
        Plotly.extendTraces('chartplotlyv', {
            y: [
                [getDatav()]
            ]
        }, [0]);

        if (stpgrp > 10) {
            clearInterval(plotupdtv);
        }



    }, 100);


    //plotly graph    //height

    var x = 0;

    function getDatah() {
        hplt = rocket.position.y;
        hplt = 470 - hplt;
        return hplt;

    }

    var layouth = {
        title: 'Altitude',
        transition: {
            duration: 100,
            easing: 'exp-out'
        }
    };

    Plotly.plot('chartplotlyh', [{
        y: [getDatah()],
        type: 'line',
        marker:{
            size:5
        },
        line:{
            color:'rgba(165,229,255,0.8)',
            width:3
        },
        fill:'tonexty',
        fillcolor:'rgba(165,229,255,0.05)'
    }], layouth, {
        displayModeBar: false
    });

    stpgrp = 0;

    var plotupdth = setInterval(function () {
        Plotly.extendTraces('chartplotlyh', {
            y: [
                [getDatah()]
            ]
        }, [0]);
        if (hplt < 5) {
            stpgrp++;
        }

        if (stpgrp > 10) {
            clearInterval(plotupdth);
        }



    }, 100);


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////Optional Rocket Flame//////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //rocketflame
    var trailflame = [];

    Events.on(render, 'afterRender', function () {
        if (Mf > 0) {
            trailflame.unshift({
                position: {
                    x: rocket.position.x + 2,
                    y: rocket.position.y + 20
                },
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

        if (Mf > 0) {
            trailflame2.unshift({
                position: {
                    x: rocket.position.x - 2,
                    y: rocket.position.y + 20
                },
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

        if (Mf > 0) {
            trailflame3.unshift({
                position: {
                    x: rocket.position.x,
                    y: rocket.position.y + 20
                },
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
