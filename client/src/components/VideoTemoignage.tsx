import { useLanguage } from "@/lib/i18n";

export default function VideoTemoignage() {
  const { language } = useLanguage();
  
  const supported = ["fr", "en", "es", "pt", "it", "de", "nl"];
  const subtitleLang = supported.includes(language) ? language : "en";

  return (
    <video
      controls
      preload="metadata"
      className="w-full rounded-3xl"
      style={{ height: '500px', objectFit: 'cover', backgroundColor: '#000' }}
      data-testid="video-testimonial"
    >
      <source src="/videos/video-temoignage.mp4" type="video/mp4" />

      <track
        label="Sous-titres"
        kind="subtitles"
        srcLang={subtitleLang}
        src={`/videos/subtitles/${subtitleLang}.vtt`}
        default
      />

      Votre navigateur ne supporte pas la lecture de vidéos.
    </video>
  );
}
