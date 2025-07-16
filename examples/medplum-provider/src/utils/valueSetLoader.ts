import { MedplumClient } from '@medplum/core';
import { ValueSet } from '@medplum/fhirtypes';

/**
 * Standard ValueSets that need to be loaded into the Medplum server.
 */
const standardValueSets: ValueSet[] = [
  // Gender Identity ValueSet
  {
    resourceType: 'ValueSet',
    url: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1021.32',
    status: 'active',
    name: 'GenderIdentity',
    title: 'Gender Identity',
    compose: {
      include: [
        {
          system: 'http://snomed.info/sct',
          concept: [
            { code: '446151000124109', display: 'Identifies as female' },
            { code: '446141000124107', display: 'Identifies as male' },
            { code: '407377005', display: 'Female-to-male transsexual' },
            { code: '407376001', display: 'Male-to-female transsexual' },
            { code: '446131000124102', display: 'Identifies as non-conforming gender' },
            { code: '74964007', display: 'Other' },
          ]
        }
      ]
    }
  },

  // Pakistan States/Provinces ValueSet
  {
    resourceType: 'ValueSet',
    url: 'http://hl7.org/fhir/us/core/ValueSet/us-core-usps-state',
    status: 'active',
    name: 'PakistanProvinces',
    title: 'Pakistan Provinces and Territories',
    compose: {
      include: [
        {
          // Using a local system - this avoids external resolution issues
          system: 'urn:iso:std:iso:3166:-2:PK',
          concept: [
            { code: 'PB', display: 'Punjab' },
            { code: 'SD', display: 'Sindh' },
            { code: 'KP', display: 'Khyber Pakhtunkhwa' },
            { code: 'BA', display: 'Balochistan' },
            { code: 'GB', display: 'Gilgit-Baltistan' },
            { code: 'AJK', display: 'Azad Jammu and Kashmir' },
            { code: 'ICT', display: 'Islamabad Capital Territory' },
            { code: 'FATA', display: 'Federally Administered Tribal Areas' }
          ]
        }
      ]
    }
  },

  // Define missing pregnancy-status ValueSet (referenced in your form)
  {
    resourceType: 'ValueSet',
    url: 'http://example.com/pregnancy-status',
    status: 'active',
    name: 'PregnancyStatus',
    title: 'Pregnancy Status',
    compose: {
      include: [
        {
          system: 'http://snomed.info/sct',
          concept: [
            { code: '77386006', display: 'Pregnancy' },
            { code: '60001007', display: 'Not pregnant' },
            { code: '161711000', display: 'Unknown' }
          ]
        }
      ]
    }
  }
];

/**
 * Creates or updates ValueSets in the Medplum server.
 * @param medplum - The Medplum client
 * @returns Promise resolving to created/updated ValueSets
 */
export async function loadStandardValueSets(medplum: MedplumClient): Promise<ValueSet[]> {
  const results: ValueSet[] = [];

  for (const valueSet of standardValueSets) {
    try {
      // Check if ValueSet already exists
      const existing = await medplum.searchOne('ValueSet', { url: valueSet.url });
      
      if (existing) {
        console.log(`ValueSet ${valueSet.url} already exists, updating...`);
        const updated = await medplum.updateResource({ ...existing, ...valueSet });
        results.push(updated);
      } else {
        console.log(`Creating new ValueSet: ${valueSet.url}`);
        const created = await medplum.createResource(valueSet);
        results.push(created);
      }
    } catch (error) {
      console.error(`Failed to create/update ValueSet ${valueSet.url}:`, error);
    }
  }

  return results;
}

/**
 * Utility function to ensure all ValueSets are loaded.
 * Call this during app initialization or before form submission.
 * @param medplum - The Medplum client
 */
export async function ensureValueSetsLoaded(medplum: MedplumClient): Promise<void> {
  try {
    await loadStandardValueSets(medplum);
    console.log('Standard ValueSets loaded successfully');
  } catch (error) {
    console.error('Failed to load standard ValueSets:', error);
  }
}
