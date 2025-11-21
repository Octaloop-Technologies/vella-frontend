"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Script from "next/script";

function WidgetContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [agentConfig, setAgentConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const agentId = params.id as string;
  const widgetType = params.type as string; // 'voice' or 'chat'
  const position = searchParams.get("position") || "bottom-right";
  const size = searchParams.get("size") || "medium";
  const color = searchParams.get("color") || "#8266D4";
  
  // Voice widget customization options
  const showAvatar = searchParams.get("showAvatar") === "true" || searchParams.get("showAvatar") === null;
  const showTitle = searchParams.get("showTitle") === "true" || searchParams.get("showTitle") === null;
  const showDuration = searchParams.get("showDuration") === "true" || searchParams.get("showDuration") === null;
  const buttonColor = searchParams.get("buttonColor") || "#8266D4";
  const iconColor = searchParams.get("iconColor") || "#FFFFFF";

  useEffect(() => {
    // Fetch agent configuration
    fetch(`/api/widget/config/${agentId}`)
      .then((res) => res.json())
      .then((data) => {
        setAgentConfig(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load widget configuration");
        setLoading(false);
      });
  }, [agentId]);

  // Initialize widget after script loads
  useEffect(() => {
    if (scriptLoaded && agentConfig && typeof window !== 'undefined') {
      const vellaConfig = {
        agentId: agentId,
        widgetType: widgetType === 'voice' ? 'inline-voice' : 'chat',
        containerId: 'vella-widget-container',
        size: size,
        primaryColor: color,
        title: agentConfig.name || 'AI Assistant',
        apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://ai-voice-agent-backend.octaloop.dev',
        widgetBaseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        // Voice widget customization
        showAvatar: showAvatar,
        showTitle: showTitle,
        showDuration: showDuration,
        buttonColor: buttonColor,
        iconColor: iconColor
      };

      console.log('🎯 Initializing Vella Widget with config:', vellaConfig);

      // Wait a bit for DOM to be ready
      setTimeout(() => {
        if ((window as any).VellaWidget) {
          (window as any).VellaWidget.init(vellaConfig);
        } else {
          console.error('VellaWidget not found on window');
        }
      }, 100);
    }
  }, [scriptLoaded, agentConfig, agentId, widgetType, size, color, showAvatar, showTitle, showDuration, buttonColor, iconColor]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading widget...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Load the widget script */}
      <Script
        src={`/api/widget/script?t=${Date.now()}`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('✅ Widget script loaded');
          setScriptLoaded(true);
        }}
        onError={(e) => {
          console.error('❌ Failed to load widget script:', e);
          setError('Failed to load widget script');
        }}
      />

      {/* Widget will be mounted here */}
      <div 
        id="vella-widget-container"
        className="flex items-center justify-center min-h-screen bg-white p-4"
      ></div>
    </>
  );
}

export default function WidgetPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      }
    >
      <WidgetContent />
    </Suspense>
  );
}
