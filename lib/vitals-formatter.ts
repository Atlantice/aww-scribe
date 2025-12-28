/**
 * Formats verbose vital sign text into medical abbreviations
 */
export function formatVitalSign(
  value: string | undefined,
  type: 'temperature' | 'heartRate' | 'respiratoryRate' | 'weight'
): string {
  if (!value) return '--'

  let formatted = value.trim()

  switch (type) {
    case 'temperature':
      // "101.8 degrees Fahrenheit" → "101.8°F"
      // "38.8 degrees Celsius" → "38.8°C"
      formatted = formatted
        .replace(/degrees?\s*fahrenheit/gi, '°F')
        .replace(/degrees?\s*celsius/gi, '°C')
        .replace(/\s*°\s*F/gi, '°F') // Clean up spacing
        .replace(/\s*°\s*C/gi, '°C')
      break

    case 'heartRate':
      // "88 beats per minute" → "88 bpm"
      // "92 beats per minute" → "92 bpm"
      formatted = formatted
        .replace(/beats?\s*per\s*minute/gi, 'bpm')
        .replace(/\s+bpm/gi, ' bpm') // Ensure space before unit
      break

    case 'respiratoryRate':
      // "24 per minute" → "24/min"
      // "24 breaths per minute" → "24/min"
      formatted = formatted
        .replace(/breaths?\s*per\s*minute/gi, '/min')
        .replace(/per\s*minute/gi, '/min')
        .replace(/\s+\/min/gi, '/min') // Remove space before unit
      break

    case 'weight':
      // "65 pounds" → "65 lbs"
      // "29.5 kilograms" → "29.5 kg"
      formatted = formatted
        .replace(/pounds?/gi, 'lbs')
        .replace(/kilograms?/gi, 'kg')
        .replace(/\s+lbs/gi, ' lbs') // Ensure space before unit
        .replace(/\s+kg/gi, ' kg')
      break
  }

  return formatted
}

/**
 * Splits a formatted vital sign into value and unit for separate styling
 * Example: "101.8°F" → { value: "101.8", unit: "°F" }
 */
export function splitVitalSign(formattedValue: string): { value: string; unit: string } {
  // Match patterns like "101.8°F", "88 bpm", "24/min", "65 lbs"
  const match = formattedValue.match(/^([\d.]+)\s*(.+)$/)

  if (match) {
    return {
      value: match[1],
      unit: match[2],
    }
  }

  // Fallback: return entire value
  return {
    value: formattedValue,
    unit: '',
  }
}
