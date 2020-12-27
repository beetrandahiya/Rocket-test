//view variables

var renderwidth=300;
var renderheight=600;






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
        width: renderwidth,
        height: renderheight,
        wireframes: false,

        background: '#a5e5ff'
    }
});


var ground = Bodies.rectangle(renderwidth/2, renderheight, 1000, 20, {
    isStatic: true,
    render: {
        fillStyle: '#777777',
        strokeStyle: '#777777',
        lineWidth: 3
    }
});
World.add(engine.world, [ground]);

//run the engine
Engine.run(engine);


//run the renderer
Render.run(render);


function project(){

    //rocket variables


    var Mi=$('#Massi').val();         
    var Mp
    var Pexh=$('#pressureexh').val();    //exhaust pressure
    
}