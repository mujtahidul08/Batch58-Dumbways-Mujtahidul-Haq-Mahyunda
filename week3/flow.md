# Deployment Flow for Application

## 1. Ensure App Runs Smoothly
   - Confirm the application runs without issues locally.

## 2. Remove Sequelize-Related Configurations
   - Delete all files related to Sequelize: `config`, `models`, `seeders`, and `migrations`.
   - Update imports in `app.js` to reflect the changes.

## 3. Resolve Errors
   - If `Cannot post` errors occur, check the Vercel error logs.
   - Example error: `defaultValue : Sequelize.literal("CURRENT_TIMESTAMP")`

## 4. Set Up Vercel PostgreSQL Storage
   - Create a PostgreSQL storage instance on Vercel.

## 5. Attempt Initial Deployment (Expect Failure)
   - Deploy to identify additional issues.

## 6. Add `vercel.json` Configuration File
   - Follow this guide for configuration: [Vercel deployment guide](https://medium.com/@ShrianshAgarwal/deploying-express-backend-to-vercel-7664ef880005).

## 7. Check Deployment Logs for Errors
   - If `pg` package is missing, install it.
   - Additional reference: [Vercel discussion on pg package](https://github.com/orgs/vercel/discussions/234).

## 8. Convert `config.json` to `config.js`
   - Change the configuration file to `config.js`.
   - Update all imports to use `config.js` instead of `config.json`.

## 9. Add `dotenv` for Environment Variables Management
   - Use `dotenv` to manage environment variables securely.

## 10. Migrate `vercel.json` to Use Environment Variables
   - Update `vercel.json` to reference `.env` for environment-specific settings.
   - Remove the "test" environment (staging is currently unnecessary).

## 11. Update Sequelize Config in `app.js` Based on `NODE_ENV`
   - Adjust Sequelize configuration to switch environments based on `NODE_ENV`.
   - Include cookie management, even though support may be limited for now.

## 12. Resolve Insecure Connection Error
   - If `ERROR: connection is insecure` appears, add the following SSL options in `config.js`:

     ```javascript
     dialectOptions: {
       ssl: {
         require: true,
         rejectUnauthorized: false,
       },
     },
     ```

## 13. Create a `.env` File and Test Locally
   - Add necessary environment variables to `.env` and verify local functionality.

## 14. Add a `.env.sample` File as a Best Practice
   - This sample file should document required environment variables for developers.

## 15. Ignore the `.env` File in `.gitignore`
   - Add `.env` to `.gitignore` before pushing to version control.

## 16. Connect PostgreSQL Database
   - Connect the application to the PostgreSQL database.

## 17. Add Environment Variables in Vercel and Redeploy
   - Use the PostgreSQL connection key directly in Vercel environment settings and redeploy.

## 18. Update Deployment Scripts in `package.json`
   - Set up `postinstall` to run Sequelize migrations automatically:

     ```json
     "scripts": {
       "postinstall": "sequelize db:migrate"
     }
     ```

---
