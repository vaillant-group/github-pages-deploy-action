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
    ___   __   ____  _  _  _  _  ____ 
    / __) (  ) (_  _)/ )( \/ )( \(  _ \
   ( (_ \  )(    )(  ) __ () \/ ( ) _ (
    \___/ (__)  (__) \_)(_/\____/(____/
    ____   __    ___  ____  ____       
   (  _ \ / _\  / __)(  __)/ ___)      
    ) __//    \( (_ \ ) _) \___ \      
   (__)  \_/\_/ \___/(____)(____/      
    ____  ____  ____  __     __   _  _ 
   (    \(  __)(  _ \(  )   /  \ ( \/ )
    ) D ( ) _)  ) __// (_/\(  O ) )  / 
   (____/(____)(__)  \____/ \__/ (__/  
     __    ___  ____   __    __   __ _ 
    / _\  / __)(_  _) (  )  /  \ (  ( \
   /    \( (__   )(    )(  (  O )/    /
   \_/\_/ \___) (__)  (__)  \__/ \_)__)
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
