import geoData from './bangladeshGeo.json';

export interface Division {
  id: string;
  name: string;
  bn_name: string;
}

export interface District {
  id: string;
  division_id: string;
  name: string;
  bn_name: string;
}

export interface Upazila {
  id: string;
  district_id: string;
  name: string;
  bn_name: string;
}

export interface BangladeshGeoData {
  divisions: Division[];
  districts: District[];
  upazilas: Upazila[];
}

export const bangladeshGeo: BangladeshGeoData = geoData as BangladeshGeoData;

/**
 * Get all 8 divisions
 */
export function getDivisions(): Division[] {
  return bangladeshGeo.divisions;
}

/**
 * Get all districts belonging to a specific division
 */
export function getDistrictsByDivision(divisionId: string): District[] {
  if (!divisionId) return [];
  return bangladeshGeo.districts.filter(
    (d) => String(d.division_id) === String(divisionId),
  );
}

/**
 * Get all upazilas belonging to a specific district
 */
export function getUpazilasByDistrict(districtId: string): Upazila[] {
  if (!districtId) return [];
  return bangladeshGeo.upazilas.filter(
    (u) => String(u.district_id) === String(districtId),
  );
}

/**
 * Find division by id
 */
export function getDivisionById(divisionId: string): Division | undefined {
  return bangladeshGeo.divisions.find((d) => String(d.id) === String(divisionId));
}

/**
 * Find district by id
 */
export function getDistrictById(districtId: string): District | undefined {
  return bangladeshGeo.districts.find((d) => String(d.id) === String(districtId));
}

/**
 * Find upazila by id
 */
export function getUpazilaById(upazilaId: string): Upazila | undefined {
  return bangladeshGeo.upazilas.find((u) => String(u.id) === String(upazilaId));
}

/**
 * Helper to format a combined location string: e.g. "শ্রীপুর, গাজীপুর, ঢাকা"
 */
export function formatLocationString({
  divisionId,
  districtId,
  upazilaId,
  locale = 'bn',
}: {
  divisionId?: string;
  districtId?: string;
  upazilaId?: string;
  locale?: 'bn' | 'en';
}): string {
  const parts: string[] = [];

  if (upazilaId) {
    const upazila = getUpazilaById(upazilaId);
    if (upazila) parts.push(locale === 'bn' ? upazila.bn_name : upazila.name);
  }

  if (districtId) {
    const district = getDistrictById(districtId);
    if (district) parts.push(locale === 'bn' ? district.bn_name : district.name);
  }

  if (divisionId) {
    const division = getDivisionById(divisionId);
    if (division) parts.push(locale === 'bn' ? division.bn_name : division.name);
  }

  return parts.join(', ');
}
