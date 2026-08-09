/**
 * Shared app-wide constants.
 *
 * PLAY_STORE_URL was previously duplicated in four components. It must track
 * `applicationId` in android/app/build.gradle.kts — if the package ID ever
 * changes again, this is the only place the landing page needs updating.
 */
export const PLAY_PACKAGE_ID = "com.nawahapp";

export const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${PLAY_PACKAGE_ID}`;
