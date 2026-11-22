import { describe, it, expect } from 'vitest';
import { api } from '../services/api';

describe('Commute Emission Logic', () => {
  it('calculates significant CO2 savings for Metro vs Solo Car', async () => {
    const res = await api.compareCommute(20);
    expect(res.distanceKm).toBe(20);
    
    const metro = res.options.find(o => o.mode === 'METRO');
    const car = res.options.find(o => o.mode === 'SINGLE_CAR');

    expect(metro).toBeDefined();
    expect(car).toBeDefined();
    expect(metro!.co2EmittedKg).toBeLessThan(car!.co2EmittedKg);
    expect(metro!.co2SavedVsCarKg).toBeGreaterThan(0);
  });
});
