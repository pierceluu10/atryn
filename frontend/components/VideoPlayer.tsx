"use client";

interface VideoPlayerProps {
  src: string;
  className?: string;
}

export default function VideoPlayer({ src, className }: VideoPlayerProps) {
  if (!src) {
    return (
      <div className={`bg-gray-100 rounded-xl flex items-center justify-center aspect-video ${className || ""}`}>
        <p className="text-sm text-gray-400">No video available</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl overflow-hidden bg-black ${className || ""}`}>
      <video
        src={src}
        controls
        className="w-full aspect-video object-cover"
        preload="metadata"
      />
    </div>
  );
}
