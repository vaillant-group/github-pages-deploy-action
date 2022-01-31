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
            (0, core_1.info)(`\u001b[48;5;6m
    ▄██████▄   ▄█      ███        ▄█    █▄    ███    █▄  ▀█████████▄       
    ███    ███ ███  ▀█████████▄   ███    ███   ███    ███   ███    ███      
    ███    █▀  ███▌    ▀███▀▀██   ███    ███   ███    ███   ███    ███      
   ▄███        ███▌     ███   ▀  ▄███▄▄▄▄███▄▄ ███    ███  ▄███▄▄▄██▀       
  ▀▀███ ████▄  ███▌     ███     ▀▀███▀▀▀▀███▀  ███    ███ ▀▀███▀▀▀██▄       
    ███    ███ ███      ███       ███    ███   ███    ███   ███    ██▄      
    ███    ███ ███      ███       ███    ███   ███    ███   ███    ███      
    ████████▀  █▀      ▄████▀     ███    █▀    ████████▀  ▄█████████▀       
                                                                            
     ▄███████▄    ▄████████    ▄██████▄     ▄████████    ▄████████          
    ███    ███   ███    ███   ███    ███   ███    ███   ███    ███          
    ███    ███   ███    ███   ███    █▀    ███    █▀    ███    █▀           
    ███    ███   ███    ███  ▄███         ▄███▄▄▄       ███                 
  ▀█████████▀  ▀███████████ ▀▀███ ████▄  ▀▀███▀▀▀     ▀███████████          
    ███          ███    ███   ███    ███   ███    █▄           ███          
    ███          ███    ███   ███    ███   ███    ███    ▄█    ███          
   ▄████▀        ███    █▀    ████████▀    ██████████  ▄████████▀           
                                                                            
  ████████▄     ▄████████    ▄███████▄  ▄█        ▄██████▄  ▄██   ▄         
  ███   ▀███   ███    ███   ███    ███ ███       ███    ███ ███   ██▄       
  ███    ███   ███    █▀    ███    ███ ███       ███    ███ ███▄▄▄███       
  ███    ███  ▄███▄▄▄       ███    ███ ███       ███    ███ ▀▀▀▀▀▀███       
  ███    ███ ▀▀███▀▀▀     ▀█████████▀  ███       ███    ███ ▄██   ███       
  ███    ███   ███    █▄    ███        ███       ███    ███ ███   ███       
  ███   ▄███   ███    ███   ███        ███▌    ▄ ███    ███ ███   ███       
  ████████▀    ██████████  ▄████▀      █████▄▄██  ▀██████▀   ▀█████▀        
                                       ▀                                    
     ▄████████  ▄████████     ███      ▄█   ▄██████▄  ███▄▄▄▄               
    ███    ███ ███    ███ ▀█████████▄ ███  ███    ███ ███▀▀▀██▄             
    ███    ███ ███    █▀     ▀███▀▀██ ███▌ ███    ███ ███   ███             
    ███    ███ ███            ███   ▀ ███▌ ███    ███ ███   ███             
  ▀███████████ ███            ███     ███▌ ███    ███ ███   ███             
    ███    ███ ███    █▄      ███     ███  ███    ███ ███   ███             
    ███    ███ ███    ███     ███     ███  ███    ███ ███   ███             
    ███    █▀  ████████▀     ▄████▀   █▀    ▀██████▀   ▀█   █▀              
                                                                            
  
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
        catch (e) {
            status = constants_1.Status.FAILED;
            const extractedErrorMessage = (0, util_1.extractErrorMessage)(e);
            (0, core_1.error)(extractedErrorMessage);
            (0, core_1.setFailed)(extractedErrorMessage);
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
