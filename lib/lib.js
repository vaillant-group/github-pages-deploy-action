"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const constants_1 = require("./constants");
const git_1 = require("./git");
const ssh_1 = require("./ssh");
const util_1 = require("./util");
/** Initializes and runs the action.
 *
 * @param {object} configuration - The action configuration.
 */
function run(configuration) {
    return __awaiter(this, void 0, void 0, function* () {
        let status = constants_1.Status.RUNNING;
        try {
            (0, core_1.info)(`
    .t@8@@8Xt.               
    .  . .  .X%SS:%88888@X; t%X. .  . .  .
     .   .8S.8888@@@8888@X88888:S8.       
       .;t@888888888@888888@8@888@S; . .  
   .  .X 8888@88888888888@888@@88@8.@.   .
     %888888888888@888S%8;;%t888@88888t.  
    :@888@888888X8S888@  ;%% ;8.888888@:  
   ..888@88888@888  X. ;t:888 tt8S88S@8:. 
   8S888888@8S8888     S8888@;%8.888888@S 
  .X88@888X8:X X..   . S 88:t8 8X888888XX 
  % 8888X88@88@.. .   .88.888 8 S88X88@8.t
  8SX88X88X.88t  . :%%888XX88t t88@@8888X8
  8%@88@8888;8%: :8 8%XS@@@XXt;88888@888;8
  X%88@88S:.8SX 88.8 8S8X@@@ t888888@888t@
  :88888.@ X%X@8 8.t8%@X@@:.8@88888888888;
   S@88:S S:888@@t@:X8X@;@8@X@888888888Xt 
   t88 @ S @88t8@SX:8@@8888X888888888888; 
    S:: X:88@ S;@::8888:88888888888888@%. 
     t;@%8%@X . @t;88888X888888888888 %   
      tS8%% ;8t S888@XX@@888@@@@8@@S8S   .
   .   .;ttXS8@@888@88@8SX8888888@X8  .   
     .   .X X@X8S8S8X88888X@X@SX 8.    .  
    .  . . :8t;@8888SX8888888.;8    .    .
               t8@:.t:;;::S8t.        .   
    `);
            (0, core_1.info)(`
    💖 Support: https://github.com/sponsors/JamesIves
    📣 Maintained by James Ives: https://jamesiv.es

    🚀 Getting Started Guide: https://github.com/JamesIves/github-pages-deploy-action
    ❓ Discussions / Q&A: https://github.com/JamesIves/github-pages-deploy-action/discussions
    🔧 Report a Bug: https://github.com/JamesIves/github-pages-deploy-action/issues`);
            (0, core_1.info)('Checking configuration and starting deployment… 🚦');
            const settings = Object.assign({}, configuration);
            // Defines the repository/folder paths and token types.
            // Also verifies that the action has all of the required parameters.
            settings.folderPath = (0, util_1.generateFolderPath)(settings);
            (0, util_1.checkParameters)(settings);
            settings.repositoryPath = (0, util_1.generateRepositoryPath)(settings);
            settings.tokenType = (0, util_1.generateTokenType)(settings);
            if (settings.sshKey) {
                yield (0, ssh_1.configureSSH)(settings);
            }
            yield (0, git_1.init)(settings);
            status = yield (0, git_1.deploy)(settings);
        }
        catch (error) {
            status = constants_1.Status.FAILED;
            (0, core_1.setFailed)((0, util_1.extractErrorMessage)(error));
        }
        finally {
            (0, core_1.info)(`${status === constants_1.Status.FAILED
                ? 'Deployment failed! ❌'
                : status === constants_1.Status.SUCCESS
                    ? 'Completed deployment successfully! ✅'
                    : 'There is nothing to commit. Exiting early… 📭'}`);
            (0, core_1.exportVariable)('deployment_status', status);
            (0, core_1.setOutput)('deployment-status', status);
        }
    });
}
exports.default = run;
