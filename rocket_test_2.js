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


    var Mi=$('#massi').val();         
    var Mp=$('#massp').val();         
    var Mf=$('#massf').val();         
    var Pexh=$('#pressureexh').val();    //exhaust pressure
    var Aexh=$('#areaexh').val();         
    var dmdt=$('#dmdt').val();     
    var dmdtms=dmdt/100;

    Mnet=Mi +Mp + Mf;
    var Patm=1;

    var rocket=Bodies.rectangle(renderwidth/2,renderheight-20,10,40);






    World.add(engine.world,[rocket]);



    //start loop

    var changeforce= setInterval(function(){
        if (Mf>0){

            Mnet=Mi +Mp + Mf;
            Matter.Body.setMass(rocket,Mnet);
            Fexh=(Pexh-Patm)*Aexh;
            Mf=Mf-dmdtms;
            Fnet=Fexh/50;


        }
        else if(Mf<=0){
            Mf=0;
            Fnet=0;
        }

    },10);

    
    Matter.Events.on(engine,'beforeUpdate',function(event){
        Body.applyForce(rocket,{
            x:rocket.position.x,
            y:rocket.position.y+20
        },{
            x:0,
            y:-Fnet
        });

    });

    var ydata=[]; 
    //graph 
    var options={
        chart:{
            type:'line',
            id:'realtime',
            height:400,
            animations:{
                enabled:true,
                easing:'linear',
                dynamicAnimation:{
                    speed:1
                }
            }
        }
        ,
        stroke:{
            curve:'straight'
        },
        series:[{
            data:ydata
        }],
        xaxis:{
            type:'numeric'
        }
    }

    var chartvelocity=new ApexCharts(document.querySelector("#velchart"),options);

    chartvelocity.render();
    val_x=0;

    setInterval(function(){
        vlx=val_x/100;
        let vl=rocket.velocity.y;
        vl=-vl;
        yvl_new=[vlx,vl];
        ydata.push(yvl_new);
        val_x++;

        chartvelocity.updateSeries([{
            data:ydata
        }])

    },10);


}