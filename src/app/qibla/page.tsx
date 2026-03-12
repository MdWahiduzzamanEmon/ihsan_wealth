"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  MapPin,
  Compass,
  Navigation,
  ArrowLeft,
  Locate,
  Smartphone,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QiblaCompass } from "@/components/qibla/qibla-compass";
import { useDeviceOrientation } from "@/hooks/use-device-orientation";
import {
  calculateQiblaDirection,
  calculateDistanceToKaaba,
  formatDistance,
  formatBearing,
} from "@/lib/qibla-utils";
import { slideUp, staggerContainer, staggerItem, fadeIn } from "@/lib/animations";
import { useReverseGeocode } from "@/hooks/use-reverse-geocode";
import { QIBLA_TEXTS } from "@/lib/qibla-texts";
import { getLangFromCountry } from "@/lib/islamic-content";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";

interface LocationState {
  lat: number;
  lon: number;
}

type LocationStatus = "idle" | "loading" | "success" | "error";

export default function QiblaPage() {
  const [formData] = useLocalStorage<ZakatFormData>("zakat-calculator-data", DEFAULT_FORM_DATA);
  const lang = getLangFromCountry(formData?.country || "US");
  const t = QIBLA_TEXTS[lang];

  const [location, setLocation] = useState<LocationState | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [locationError, setLocationError] = useState<string | null>(null);

  const locationName = useReverseGeocode(location?.lat ?? null, location?.lon ?? null);

  const {
    heading,
    isSupported: isCompassSupported,
    permissionState: compassPermission,
    requestPermission: requestCompassPermission,
  } = useDeviceOrientation();

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      setLocationError(t.geoNotSupported);
      return;
    }

    setLocationStatus("loading");
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLocationStatus("success");
      },
      (error) => {
        setLocationStatus("error");
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(t.permissionDenied);
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError(t.positionUnavailable);
            break;
          case error.TIMEOUT:
            setLocationError(t.timeout);
            break;
          default:
            setLocationError(t.unknownError);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [t]);

  // Auto-request location on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const qiblaBearing = location
    ? calculateQiblaDirection(location.lat, location.lon)
    : null;
  const distanceToKaaba = location
    ? calculateDistanceToKaaba(location.lat, location.lon)
    : null;

  const needsCompassPermission =
    isCompassSupported && compassPermission === "prompt";
  const isLiveCompass = heading !== null;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20">
      {/* Header banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 py-5">
        <div className="absolute inset-0 opacity-[0.07]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="qiblaGeo"
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.3"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="8"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.3"
                />
                <path
                  d="M20 2L38 20L20 38L2 20Z"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.3"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#qiblaGeo)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-5xl px-4 text-center">
          <p className="font-arabic text-3xl md:text-4xl leading-loose text-amber-300/90 tracking-wide">
            اتجاه القبلة
          </p>
          <p className="mt-1 text-xs text-emerald-300/70 italic tracking-wider">
            {t.headerSubtitle}
          </p>
        </div>
      </div>

      {/* Top navigation bar */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-emerald-700 hover:text-emerald-800 gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.backToHome}
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-emerald-600">
            <Compass className="h-4 w-4" />
            <span className="text-sm font-medium">{t.qiblaFinder}</span>
          </div>
        </div>
      </div>

      <main className="flex-1 mx-auto max-w-2xl w-full px-4 py-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-6"
        >
          {/* Loading state */}
          {locationStatus === "loading" && (
            <motion.div variants={fadeIn}>
              <Card className="border-emerald-200 bg-emerald-50/50">
                <CardContent className="py-16 text-center">
                  <motion.div
                    className="mx-auto mb-4 h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Locate className="h-6 w-6 text-emerald-600" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-emerald-800 mb-1">
                    {t.findingLocation}
                  </h3>
                  <p className="text-sm text-emerald-600/70">
                    {t.allowLocation}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Error state */}
          {locationStatus === "error" && (
            <motion.div variants={slideUp}>
              <Card className="border-red-200 bg-red-50/50">
                <CardContent className="py-10 text-center">
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    {t.locationError}
                  </h3>
                  <p className="text-sm text-red-600/80 mb-4 max-w-md mx-auto">
                    {locationError}
                  </p>
                  <Button
                    onClick={requestLocation}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                  >
                    <Locate className="h-4 w-4" />
                    {t.tryAgain}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Idle state */}
          {locationStatus === "idle" && (
            <motion.div variants={slideUp}>
              <Card className="border-emerald-200">
                <CardContent className="py-10 text-center">
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-emerald-800 mb-2">
                    {t.findQiblaDirection}
                  </h3>
                  <p className="text-sm text-emerald-600/70 mb-4 max-w-md mx-auto">
                    {t.allowLocationDesc}
                  </p>
                  <Button
                    onClick={requestLocation}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                  >
                    <Locate className="h-4 w-4" />
                    {t.enableLocation}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Compass and info - shown when location is available */}
          {locationStatus === "success" &&
            location &&
            qiblaBearing !== null &&
            distanceToKaaba !== null && (
              <>
                {/* Compass permission request for iOS */}
                {needsCompassPermission && (
                  <motion.div variants={staggerItem}>
                    <Card className="border-amber-200 bg-amber-50/50">
                      <CardContent className="py-5">
                        <div className="flex items-start gap-3">
                          <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                            <Smartphone className="h-4 w-4 text-amber-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-amber-800 mb-1">
                              {t.enableLiveCompass}
                            </h4>
                            <p className="text-xs text-amber-700/70 mb-3">
                              {t.enableCompassDesc}
                            </p>
                            <Button
                              onClick={requestCompassPermission}
                              size="sm"
                              className="bg-amber-500 hover:bg-amber-600 text-white gap-1.5"
                            >
                              <Compass className="h-3.5 w-3.5" />
                              {t.enableCompass}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Compass visualization */}
                <motion.div
                  variants={staggerItem}
                  className="flex justify-center"
                >
                  <QiblaCompass
                    qiblaBearing={qiblaBearing}
                    compassHeading={heading}
                    isLive={isLiveCompass}
                  />
                </motion.div>

                {/* Info cards */}
                <motion.div
                  variants={staggerItem}
                  className="grid grid-cols-2 gap-3"
                >
                  {/* Qibla bearing */}
                  <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white">
                    <CardContent className="py-4 text-center">
                      <div className="mx-auto mb-2 h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                        <Navigation className="h-4 w-4 text-amber-600" />
                      </div>
                      <p className="text-xs text-emerald-600/70 mb-0.5">
                        {t.qiblaDirection}
                      </p>
                      <p className="text-2xl font-bold text-emerald-800">
                        {qiblaBearing.toFixed(1)}°
                      </p>
                      <p className="text-xs text-emerald-600/60">
                        {formatBearing(qiblaBearing)} {t.fromNorth}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Distance */}
                  <Card className="border-emerald-200 bg-gradient-to-br from-amber-50/50 to-white">
                    <CardContent className="py-4 text-center">
                      <div className="mx-auto mb-2 h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-emerald-600" />
                      </div>
                      <p className="text-xs text-emerald-600/70 mb-0.5">
                        {t.distanceToKaaba}
                      </p>
                      <p className="text-2xl font-bold text-emerald-800">
                        {formatDistance(distanceToKaaba)}
                      </p>
                      <p className="text-xs text-emerald-600/60">
                        Masjid al-Haram
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Location details */}
                <motion.div variants={staggerItem}>
                  <Card className="border-emerald-200/60">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-xs text-emerald-700/70">
                            {locationName || t.yourLocation}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-emerald-600/60">
                          {location.lat.toFixed(4)}°,{" "}
                          {location.lon.toFixed(4)}°
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Desktop fallback message */}
                {!isCompassSupported && (
                  <motion.div variants={staggerItem}>
                    <Card className="border-emerald-200/60 bg-emerald-50/30">
                      <CardContent className="py-5">
                        <div className="flex items-start gap-3">
                          <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <Compass className="h-4 w-4 text-emerald-600" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-emerald-800 mb-1">
                              {t.usingDesktop}
                            </h4>
                            <p className="text-xs text-emerald-600/70 leading-relaxed">
                              {t.desktopDesc.replace("{bearing}", `${qiblaBearing.toFixed(1)}° ${formatBearing(qiblaBearing)}`)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Compass denied message */}
                {compassPermission === "denied" && (
                  <motion.div variants={staggerItem}>
                    <Card className="border-amber-200/60 bg-amber-50/30">
                      <CardContent className="py-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-amber-700/70 leading-relaxed">
                            {t.compassDenied.replace("{bearing}", `${qiblaBearing.toFixed(1)}° ${formatBearing(qiblaBearing)}`)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Islamic note */}
                <motion.div variants={staggerItem}>
                  <div className="text-center py-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
                      <div className="font-arabic text-emerald-300/50 text-lg">
                        &#10022;
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
                    </div>
                    <p
                      className="font-arabic text-lg text-amber-600/60 mb-1"
                      dir="rtl"
                    >
                      فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ
                    </p>
                    <p className="text-xs text-emerald-600/50 italic max-w-sm mx-auto">
                      &ldquo;{t.quranVerse}&rdquo;
                      &mdash; Quran 2:144
                    </p>
                  </div>
                </motion.div>
              </>
            )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-gradient-to-b from-emerald-950 to-emerald-950 px-4 py-6 text-center">
        <p className="text-xs text-emerald-400/40">
          {t.footerNote}
        </p>
        <p className="mt-1 text-xs text-emerald-400/30">
          <span className="font-arabic">جزاكم الله خيرا</span> &mdash; {t.jazakallah}
        </p>
      </footer>
    </div>
  );
}
