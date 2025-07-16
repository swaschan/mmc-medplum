import { MedplumClient } from '@medplum/core';
import dotenv from 'dotenv';
import { loadStandardValueSets } from '../utils/valueSetLoader.js';

// Load environment variables
dotenv.config();

async function main(): Promise<void> {
  console.log('Starting ValueSet preloader...');
  
  // Create Medplum client
  const baseUrl = process.env.MEDPLUM_BASE_URL || 'https://api.medplum.com/';
  console.log(`Using Medplum server: ${baseUrl}`);
  
  const medplum = new MedplumClient({
    baseUrl,
  });

  try {
    // Login using client credentials
    console.log('Authenticating with Medplum...');
    
    // Check if client credentials are set properly
    if (!process.env.MEDPLUM_CLIENT_ID || !process.env.MEDPLUM_CLIENT_SECRET || 
        process.env.MEDPLUM_CLIENT_ID === 'your-client-id' || 
        process.env.MEDPLUM_CLIENT_SECRET === 'your-client-secret') {
      
      console.error('\n⚠️ Invalid or missing client credentials in .env file.');
      console.error('\nTo create proper client credentials:');
      console.error('1. Log in to your Medplum server at ' + baseUrl);
      console.error('2. Go to "Admin" → "Client Applications"');
      console.error('3. Click "New client application"');
      console.error('4. Create a client with the following settings:');
      console.error('   - Name: ValueSet Loader');
      console.error('   - Redirect URI: http://localhost');
      console.error('   - Access Policy: (select a policy that allows ValueSet creation)');
      console.error('5. After creating, copy the Client ID and Client Secret');
      console.error('6. Update your .env file with these values\n');
      
      // Just exit - no need to wait
      process.exit(1);
    }
    
    try {
      // Try to authenticate
      await medplum.startClientLogin(
        process.env.MEDPLUM_CLIENT_ID,
        process.env.MEDPLUM_CLIENT_SECRET
      );
      
      console.log('✅ Authentication successful!');
      
      // Load ValueSets
      console.log('Loading standard ValueSets...');
      const results = await loadStandardValueSets(medplum);
      console.log(`✅ Successfully loaded ${results.length} ValueSets`);
    } catch (authError: any) {
      console.error('\n❌ Authentication failed: ' + (authError.message || 'Unknown error'));
      
      if (authError.outcome?.issue?.[0]?.details?.text) {
        console.error('Error details: ' + authError.outcome.issue[0].details.text);
      }
      
      console.error('\nPossible solutions:');
      console.error('1. Verify that your Medplum server is running at: ' + baseUrl);
      console.error('2. Check that your client credentials are correct');
      console.error('3. Ensure the client has permissions to create/update ValueSet resources');
      console.error('4. If using a self-hosted Medplum server, verify it\'s properly configured\n');
      
      process.exit(1);
    }
  } catch (error: any) {
    console.error('Error:', error.message || error);
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
