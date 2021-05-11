import { JB2APATREONDB } from "./jb2a-patreon-database.js";
import { JB2AFREEDB } from "./jb2a-free-database.js";

const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

async function explodeTemplate(handler) {
    
    function moduleIncludes(test) {
        return !!game.modules.get(test);
    }

    let obj01 = moduleIncludes("jb2a_patreon") === true ? JB2APATREONDB : JB2AFREEDB;

    let obj02;
    let obj03;
    let color;

    let filePath;
    switch (true) {
        case handler.animExVariant === "shatter":
            obj02 = "shatter";
            switch (true) {
                case handler.animExColor === "a1" || handler.animExColor === ``:
                case !handler.animExColor:
                    color = "blue";
                    break;
                default:
                    color = handler.animExColor;
            }
            filePath = obj01[obj02][color];
            break;
        case handler.animExVariant === "01":
            obj03 = "01";
            obj02 = "explosion";
            switch (true) {
                case handler.animExColor === "a1" || handler.animExColor === ``:
                case !handler.animExColor:
                    color = "orange";
                    break;
                default:
                    color = handler.animExColor;
            }
            filePath = obj01[obj02][obj03][color];
            break;
        default:
            obj03 = "02";
            obj02 = "explosion";
            switch (true) {
                case handler.animExColor === "a1" || handler.animExColor === ``:
                case !handler.animExColor:
                    color = "blue";
                    break;
                default:
                    color = handler.animExColor;
            }
            filePath = obj01[obj02][obj03][color];
    }

    let divisor = 100;
    switch (true) {
        case (handler.animExRadius === "2"):
            divisor = 300;
            break;
        case (handler.animExRadius === "5"):
            divisor = 200;
            break;
        case (handler.animExRadius === "10"):
            divisor = 100;
            break;
        case (handler.animExRadius === "15"):
            divisor = 67;
            break;
        case (handler.animExRadius === "20"):
            divisor = 50;
            break;
        case (handler.animExRadius === "25"):
            divisor = 40;
            break;
        case (handler.animExRadius === "30"):
            divisor = 33;
            break;
        case (handler.animExRadius === "35"):
            divisor = 28.5;
            break;
        case (handler.animExRadius === "40"):
            divisor = 25;
            break;
        case (handler.animExRadius === "45"):
            divisor = 22.2;
            break;
        case (handler.animExRadius === "50"):
            divisor = 20;
            break;
        case (handler.animExRadius === "nuclear"):
            divisor = 10;
            break;
    }
    let globalDelay = game.settings.get("autoanimations", "globaldelay");
    await wait(globalDelay);

    async function cast() {
        let loops = handler.animExLoop;
        //Finds the center of the placed circular template and plays an animation using FXMaster
        const templateID = canvas.templates.placeables[canvas.templates.placeables.length - 1].data._id;
        let template = await canvas.templates.get(templateID);
        // Scaled globally, change divisor for different size animation.
        let Scale = (canvas.scene.data.grid / divisor);
        //var handler.allTargets = Array.from(lastArg.targets);
        //let target = handler.allTargets[i];

        // Defines the spell template for FXMaster
        let spellAnim =
        {
            file: filePath,
            position: template.center,
            anchor: {
                x: 0.5,
                y: 0.5
            },
            angle: 0,
            scale: {
                x: Scale,
                y: Scale
            }
        };

        async function SpellAnimation(number) {

            let x = number;
            let interval = 1000;
            for (var i = 0; i < x; i++) {
                setTimeout(function () {
                    canvas.fxmaster.playVideo(spellAnim);
                    game.socket.emit('module.fxmaster', spellAnim);
                }, i * interval);
            }
        }
        // The number in parenthesis sets the number of times it loops
        SpellAnimation(loops)

        let shockWave =
            [{
                filterType: "wave",
                filterId: "shockWave",
                autoDestroy: true,
                time: 0,
                strength: 0.03,
                frequency: 15,
                maxIntensity: 4.0,
                minIntensity: 0.5,
                padding: 25,
                animated:
                {
                    time:
                    {
                        loopDuration: 500,
                        loops: 5,
                        active: true,
                        speed: 0.0180,
                        animType: "move",
                    }
                }
            }];
        if (game.settings.get("autoanimations", "tmfx")) {
            await wait(400);
            TokenMagic.addUpdateFiltersOnTargeted(shockWave);
            //await wait(2500);
            //TokenMagic.deleteFiltersOnTargeted("burn");
            //await wait(250);
            //TokenMagic.deleteFiltersOnTargeted("shockWave");
        }
    }
    cast();
}

export default explodeTemplate;