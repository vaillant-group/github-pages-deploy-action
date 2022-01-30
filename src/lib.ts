import {exportVariable, info, setFailed, setOutput} from '@actions/core'
import {ActionInterface, NodeActionInterface, Status} from './constants'
import {deploy, init} from './git'
import {configureSSH} from './ssh'
import {
  checkParameters,
  extractErrorMessage,
  generateFolderPath,
  generateRepositoryPath,
  generateTokenType
} from './util'

/** Initializes and runs the action.
 *
 * @param {object} configuration - The action configuration.
 */
export default async function run(
  configuration: ActionInterface | NodeActionInterface
): Promise<void> {
  let status: Status = Status.RUNNING

  try {
    info(`
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
    `)

    info(`
    💖 Support: https://github.com/sponsors/JamesIves
    📣 Maintained by James Ives: https://jamesiv.es

    🚀 Getting Started Guide: https://github.com/JamesIves/github-pages-deploy-action
    ❓ Discussions / Q&A: https://github.com/JamesIves/github-pages-deploy-action/discussions
    🔧 Report a Bug: https://github.com/JamesIves/github-pages-deploy-action/issues`)

    info('Checking configuration and starting deployment… 🚦')

    const settings: ActionInterface = {
      ...configuration
    }

    // Defines the repository/folder paths and token types.
    // Also verifies that the action has all of the required parameters.
    settings.folderPath = generateFolderPath(settings)

    checkParameters(settings)

    settings.repositoryPath = generateRepositoryPath(settings)
    settings.tokenType = generateTokenType(settings)

    if (settings.sshKey) {
      await configureSSH(settings)
    }

    await init(settings)
    status = await deploy(settings)
  } catch (error) {
    status = Status.FAILED
    setFailed(extractErrorMessage(error))
  } finally {
    info(
      `${
        status === Status.FAILED
          ? 'Deployment failed! ❌'
          : status === Status.SUCCESS
          ? 'Completed deployment successfully! ✅'
          : 'There is nothing to commit. Exiting early… 📭'
      }`
    )

    exportVariable('deployment_status', status)
    setOutput('deployment-status', status)
  }
}
