// normalize-phone.js - CORRECTED VERSION
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    function normalizePhoneNumber(phone) {
      // Remove any spaces, dashes, or special characters
      let cleaned = phone.replace(/[\s\-\(\)]/g, '');
      
      // Remove leading + if present
      if (cleaned.startsWith('+')) {
        cleaned = cleaned.substring(1);
      }
      
      // Handle different formats
      
      // If it starts with 0 (e.g., 07... or 01...)
      if (cleaned.startsWith('0')) {
        // Remove the leading 0 and add 254
        cleaned = '254' + cleaned.substring(1);
      }
      // If it starts with 7 or 1 and is 9 digits (e.g., 712345678)
      else if ((cleaned.startsWith('7') || cleaned.startsWith('1')) && cleaned.length === 9) {
        cleaned = '254' + cleaned;
      }
      // If it starts with 254 but has extra digits or wrong format
      else if (cleaned.startsWith('254')) {
        // Ensure it's exactly 12 digits (254 + 9 digits)
        if (cleaned.length !== 12) {
          return null;
        }
      }
      // Any other format is invalid
      else {
        return null;
      }
      
      // Final validation: should be 12 digits and start with 254
      if (cleaned.length !== 12 || !cleaned.startsWith('254')) {
        return null;
      }
      
      return cleaned;
    }

    const normalizedPhone = normalizePhoneNumber(phone);

    if (!normalizedPhone) {
      return res.status(400).json({ 
        error: 'Invalid phone number format. Please use 07XXXXXXXX, 01XXXXXXXX, or 254XXXXXXXXX' 
      });
    }

    res.status(200).json({
      success: true,
      normalized_phone: normalizedPhone
    });

  } catch (error) {
    console.error('Phone normalization error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      success: false
    });
  }
}