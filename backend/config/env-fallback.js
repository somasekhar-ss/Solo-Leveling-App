// Fallback environment configuration for Railway
module.exports = {
    MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://ssnani192_db_user:kLj01kNg0nPBgp8n@cluster0.jy1yas6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    JWT_SECRET: process.env.JWT_SECRET || 'thisismyfirstmernprojectanditscool12345',
    PORT: process.env.PORT || 5001,
    NODE_ENV: process.env.NODE_ENV || 'production'
};