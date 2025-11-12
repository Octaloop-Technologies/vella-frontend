"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AgentCreationLayout from "@/components/agent/AgentCreationLayout";
import StepNavigation from "@/components/agent/StepNavigation";
import {
  AgentCreationProvider,
  useAgentCreation,
} from "@/contexts/AgentCreationContext";
import {
  Step3Channels,
  Step3WidgetSettings,
  Step4PhoneNumber,
  Step5ReviewPublish,
} from "@/components/agent/AgentSteps";
import Input from "@/components/shared/Input";
import Card from "@/components/shared/Card";
import Image from "next/image";
import {
  useAgentTypes,
  useLanguages,
  useGenders,
  useAccentsByGender,
  usePersonasByAccent,
  useVoiceDetails,
} from "@/hooks/useConfig";
import { useToast } from "@/contexts/ToastContext";

// Step Components
function Step1() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentType = searchParams.get("type") || "inbound";
  const { agentData, updateAgentData } = useAgentCreation();
  const { addToast } = useToast();

  // AI description generator state
  const [showGenPanel, setShowGenPanel] = useState(false);
  const [genRequest, setGenRequest] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Configuration hooks
  const {
    agentTypes,
    loading: agentTypesLoading,
    error: agentTypesError,
  } = useAgentTypes();
  const {
    languages,
    loading: languagesLoading,
    error: languagesError,
  } = useLanguages();
  const {
    genders,
    loading: gendersLoading,
    error: gendersError,
  } = useGenders();
  const {
    accents,
    loading: accentsLoading,
    error: accentsError,
  } = useAccentsByGender(agentData.gender);
  const {
    personas,
    loading: personasLoading,
    error: personasError,
  } = usePersonasByAccent(agentData.accent, agentData.gender);
  const { voiceDetails, loading: voiceLoading } = useVoiceDetails(
    agentData.voiceId
  );

  // Auto-set tune from voice details
  React.useEffect(() => {
    if (
      voiceDetails?.success &&
      voiceDetails.voice.labels.descriptive &&
      agentData.tune !== voiceDetails.voice.labels.descriptive
    ) {
      updateAgentData({ tune: voiceDetails.voice.labels.descriptive });
    }
  }, [voiceDetails, agentData.tune, updateAgentData]);

  const handleNext = () => {
    // Validate required fields
    const requiredFields = [
      { field: agentData.agentName, name: "Agent Name" },
      { field: agentData.agentTypeDropdown || agentType, name: "Agent Type" },
      { field: agentData.channelType, name: "Channel Type" },
      { field: agentData.description, name: "Description" },
      { field: agentData.language, name: "Language" },
      { field: agentData.gender, name: "Gender" },
      { field: agentData.accent, name: "Accent" },
      { field: agentData.persona, name: "Persona" },
    ];

    const missingFields = requiredFields.filter(
      ({ field }) => !field || field.trim() === ""
    );

    if (missingFields.length > 0) {
      const fieldNames = missingFields.map(({ name }) => name).join(", ");
      addToast({
        message: `Please fill in the following required fields: ${fieldNames}`,
        type: "error",
      });
      return;
    }

    router.push(`/dashboard/agent/create?type=${agentType}&step=2`);
  };

  const handlePrevious = () => {
    router.push("/dashboard/agent");
  };

  return (
    <div className="p-6 overflow-auto h-[80vh] ">
      {/* Header */}
      <div className="mb-8 ">
        <h1 className="text-2xl font-bold text-[#0A0A0A] mb-2">
          Basic Details
        </h1>
        <p className="text-[#717182] text-base">
          Provide the basic information for your agent
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Agent Name and Agent Type in one row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Agent Name */}
          <div>
            <Input
              label="Agent Name *"
              value={agentData.agentName}
              onChange={(e) => {
                if (e.target.value.length <= 20) {
                  updateAgentData({ agentName: e.target.value });
                }
              }}
              placeholder="Type..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {agentData.agentName?.length || 0}/20 characters
            </p>
          </div>

          {/* Agent Type Dropdown */}
          <div>
            <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
              Channel Type *
            </label>
            <div className="relative">
              <select
                value={agentData.channelType || ""}
                onChange={(e) =>
                  updateAgentData({ channelType: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#EBEBEB] rounded-[10px] outline-none text-sm text-[#1E1E1E] appearance-none cursor-pointer focus:bg-[#E0E0E0] transition-colors"
                required
              >
                <option value="">Select Channel Type</option>
                {(agentType === "outbound" || agentType === "inbound") ? (
                  <option value="phone_only">Phone</option>
                ) : (
                  <>
                    <option value="phone_only">Phone</option>
                    <option value="chat_only">Chat</option>
                    <option value="omnichannel">Omnichannel</option>
                  </>
                )}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path
                    d="M1 1.5L6 6.5L11 1.5"
                    stroke="#1E1E1E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Description (with AI generator) */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
              Description *
            </label>
            <button
              type="button"
              onClick={() => {
                // Prefill a reasonable user_request based on current inputs
                const seed =
                  agentData.description ||
                  `I am creating an agent named ${
                    agentData.agentName || "Sales Assistant"
                  }. Please generate a concise professional agent description suitable for ${
                    agentData.agentTypeDropdown || agentType
                  } use.`;
                setGenRequest(seed);
                setShowGenPanel((s) => !s);
              }}
              className="text-sm text-[#8266D4] hover:underline"
            >
              {showGenPanel ? "Close AI" : "Generate with AI"}
            </button>
          </div>

          <textarea
            placeholder="Type..."
            value={agentData.description}
            onChange={(e) => {
              if (e.target.value.length <= 500) {
                updateAgentData({ description: e.target.value });
              }
            }}
            rows={4}
            className="w-full px-4 py-3 bg-[#EBEBEB] rounded-[10px] outline-none text-sm text-[#1E1E1E] placeholder:text-[#9CA3AF] focus:bg-[#E0E0E0] transition-colors resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {agentData.description?.length || 0}/500 characters
          </p>

          {showGenPanel && (
            <div className="mt-3 p-3 border border-[#E5E7EB] rounded-lg bg-white">
              <label className="block text-xs font-medium text-[#1E1E1E] mb-2">
                Seed / Prompt for AI
              </label>
              <textarea
                value={genRequest}
                onChange={(e) => setGenRequest(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-[#F7F7F8] rounded-md text-sm outline-none text-black"
                placeholder="Describe what you want the agent to do, e.g. 'I am a sales rep, build a sales agent that...'"
              />

              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={async () => {
                    if (!genRequest.trim()) {
                      addToast({
                        message: "Please enter a prompt seed for the AI",
                        type: "error",
                      });
                      return;
                    }

                    try {
                      setIsGenerating(true);
                      const body = new URLSearchParams();
                      body.append("user_request", genRequest);
                      body.append(
                        "agent_type",
                        agentData.agentTypeDropdown || agentType || ""
                      );
                      body.append("industry", "");
                      body.append("tone", "");

                      const res = await fetch(
                        "https://ai-voice-agent-backend.octaloop.dev/agents/generate-prompt",
                        {
                          method: "POST",
                          headers: {
                            accept: "application/json",
                            "Content-Type": "application/x-www-form-urlencoded",
                          },
                          body: body.toString(),
                        }
                      );

                      if (!res.ok) {
                        const txt = await res.text().catch(() => "");
                        throw new Error(
                          `Failed to generate: ${res.status} ${txt}`
                        );
                      }

                      const data = await res.json();
                      if (data?.generated_prompt) {
                        updateAgentData({ description: data.generated_prompt });
                        addToast({
                          message: "Description generated successfully",
                          type: "success",
                        });
                        setShowGenPanel(false);
                      } else {
                        addToast({
                          message: data?.message || "No prompt returned",
                          type: "error",
                        });
                      }
                    } catch (err) {
                      addToast({
                        message:
                          err instanceof Error
                            ? err.message
                            : "Generation failed",
                        type: "error",
                      });
                    } finally {
                      setIsGenerating(false);
                    }
                  }}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-md disabled:opacity-50"
                >
                  {isGenerating ? "Generating…" : "Generate"}
                </button>

                <button
                  onClick={() => setShowGenPanel(false)}
                  className="px-4 py-2 border rounded-md text-sm text-black"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Language */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
              Language *
            </label>
            <div className="relative">
              <select
                value={agentData.language}
                onChange={(e) => updateAgentData({ language: e.target.value })}
                className="w-full px-4 py-3 bg-[#EBEBEB] rounded-[10px] outline-none text-sm text-[#1E1E1E] appearance-none cursor-pointer focus:bg-[#E0E0E0] transition-colors"
                disabled={languagesLoading}
              >
                <option value="">
                  {languagesLoading
                    ? "Loading languages..."
                    : "Select Language"}
                </option>
                {languages
                  .filter((language) => language.name.toLowerCase().includes('english'))
                  .map((language) => (
                    <option key={language.code} value={language.code}>
                      {language.name} ({language.voice_count} voices)
                    </option>
                  ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path
                    d="M1 1.5L6 6.5L11 1.5"
                    stroke="#1E1E1E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            {languagesError && (
              <p className="text-red-500 text-xs mt-1">{languagesError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
              Gender *
            </label>
            <div className="relative">
              <select
                value={agentData.gender}
                onChange={(e) => {
                  updateAgentData({
                    gender: e.target.value,
                    accent: "",
                    persona: "",
                    voiceId: "",
                    tune: "",
                  });
                }}
                className="w-full px-4 py-3 bg-[#EBEBEB] rounded-[10px] outline-none text-sm text-[#1E1E1E] appearance-none cursor-pointer focus:bg-[#E0E0E0] transition-colors"
                disabled={gendersLoading}
              >
                <option value="">
                  {gendersLoading ? "Loading genders..." : "Select Gender"}
                </option>
                {genders.map((gender) => (
                  <option key={gender.code} value={gender.code}>
                    {gender.name} ({gender.voice_count} voices)
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path
                    d="M1 1.5L6 6.5L11 1.5"
                    stroke="#1E1E1E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            {gendersError && (
              <p className="text-red-500 text-xs mt-1">{gendersError}</p>
            )}
          </div>
        </div>

        {/* Accent and Persona in one row */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
              Accent *
            </label>
            {!agentData.gender && (
              <p className="text-red-500 text-xs mb-2">Please select gender first *</p>
            )}
            <div className="relative">
              <select
                value={agentData.accent}
                onChange={(e) => {
                  updateAgentData({
                    accent: e.target.value,
                    persona: "",
                    voiceId: "",
                    tune: "",
                  });
                }}
                className="w-full px-4 py-3 bg-[#EBEBEB] rounded-[10px] outline-none text-sm text-[#1E1E1E] appearance-none cursor-pointer focus:bg-[#E0E0E0] transition-colors"
                disabled={accentsLoading}
              >
                <option value="">
                  {!agentData.gender
                    ? "No options available"
                    : accentsLoading
                    ? "Loading accents..."
                    : "Select Accent"}
                </option>
                {accents.map((accent) => (
                  <option key={accent.code} value={accent.code}>
                    {accent.name} ({accent.voice_count} voices)
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path
                    d="M1 1.5L6 6.5L11 1.5"
                    stroke="#1E1E1E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            {accentsError && (
              <p className="text-red-500 text-xs mt-1">{accentsError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
              Persona *
            </label>
            {!agentData.gender && (
              <p className="text-red-500 text-xs mb-2">Please select gender first *</p>
            )}
            <div className="relative">
              <select
                value={agentData.persona}
                onChange={(e) => {
                  updateAgentData({ persona: e.target.value });
                  // Find the selected persona and set the voice_id
                  const selectedPersona = personas.find(
                    (p) => p.code === e.target.value
                  );
                  if (selectedPersona) {
                    updateAgentData({ voiceId: selectedPersona.voice_id });
                  }
                }}
                className="w-full px-4 py-3 bg-[#EBEBEB] rounded-[10px] outline-none text-sm text-[#1E1E1E] appearance-none cursor-pointer focus:bg-[#E0E0E0] transition-colors"
                disabled={
                  personasLoading || !agentData.accent
                }
              >
                <option value="">
                  {!agentData.gender
                    ? "No options available"
                    : !agentData.accent
                    ? "Select accent first"
                    : personasLoading
                    ? "Loading personas..."
                    : "Select Persona"}
                </option>
                {personas.map((persona, index) => (
                  <option key={`${persona.code}-${index}`} value={persona.code}>
                    {persona.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path
                    d="M1 1.5L6 6.5L11 1.5"
                    stroke="#1E1E1E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            {personasError && (
              <p className="text-red-500 text-xs mt-1">{personasError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Voice Preview Section */}
      {agentData.voiceId && (
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-medium mb-4 text-black">Selected Voice & Tune</h3>
          {voiceLoading ? (
            <p className="text-sm text-gray-500 text-black">Loading voice details...</p>
          ) : voiceDetails?.success ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-[#1E1E1E]">Voice Name:</span>
                  <p className="text-[#717182] mt-1 text-black">{voiceDetails.voice.name}</p>
                </div>
                <div>
                  <span className="font-medium text-[#1E1E1E]">Tune (Tone):</span>
                  <p className="text-[#717182] mt-1 capitalize text-black">{voiceDetails.voice.labels.descriptive}</p>
                </div>
                <div>
                  <span className="font-medium text-[#1E1E1E]">Accent:</span>
                  <p className="text-[#717182] mt-1 capitalize text-black">{voiceDetails.voice.labels.accent}</p>
                </div>
                <div>
                  <span className="font-medium text-[#1E1E1E]">Age:</span>
                  <p className="text-[#717182] mt-1 capitalize text-black">{voiceDetails.voice.labels.age}</p>
                </div>
              </div>

              <div>
                <span className="font-medium text-[#1E1E1E] text-sm">Description:</span>
                <p className="text-[#717182] text-sm mt-1 text-black">{voiceDetails.voice.description}</p>
              </div>

              {voiceDetails.voice.preview_url && (
                <div>
                  <span className="font-medium text-[#1E1E1E] text-sm">
                    Voice Sample:
                  </span>
                  <div className="mt-2 p-4 bg-[#F7F7F7] rounded-[10px]">
                    <audio controls className="w-full">
                      <source
                        src={voiceDetails.voice.preview_url}
                        type="audio/mpeg"
                      />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-red-500 text-black">Failed to load voice details</p>
          )}
        </Card>
      )}

      {/* Navigation Buttons */}
      <StepNavigation
        onPrevious={handlePrevious}
        onNext={handleNext}
        previousLabel="Back"
      />
    </div>
  );
}

// Step 2: Knowledge Base (same for all, updated onNext conditional)
function Step2() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentType = searchParams.get("type") || "inbound";
  const { agentData, updateAgentData } = useAgentCreation();

  const documents = [
    {
      id: "product-faq",
      name: "Product FAQ",
      lastUpdated: "Last updated 2 days ago",
    },
    {
      id: "sales-playbook",
      name: "Sales Playbook",
      lastUpdated: "Last updated 2 days ago",
    },
    {
      id: "support-guidelines",
      name: "Support Guidelines",
      lastUpdated: "Last updated 2 days ago",
    },
  ];

  const toggleDocument = (docId: string) => {
    const current = agentData.selectedDocuments || [];
    if (current.includes(docId)) {
      updateAgentData({
        selectedDocuments: current.filter((id) => id !== docId),
      });
    } else {
      updateAgentData({ selectedDocuments: [...current, docId] });
    }
  };

  const nextStep = agentType === "widget" ? 3 : 3; // For widget, next is 3 (widget settings), else 3 (channels)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0A0A0A] mb-2">
          Knowledge Base
        </h1>
        <p className="text-[#717182] text-base">
          Select documents to power your agent's knowledge
        </p>
      </div>

      <div className="py-5 px-3.5 text-sm text-[#2B231E] font-medium opacity-50 mb-6 bg-[#EBEBEB] border border-[#EBEBEB] rounded-lg">
        Choose which documents from your knowledge base this agent should have
        access to.
      </div>

      <div className="space-y-4">
        {documents.map((doc) => (
          <Card
            key={doc.id}
            className="flex items-center justify-between p-4 rounded-[12px] border border-[#E5E7EB]"
          >
            <div className="flex items-center space-x-4">
              <Image
                src="/svgs/page.svg"
                alt="Document Icon"
                width={24}
                height={24}
              />
              <div className='space-y-1'>
                <h3 className="font-medium text-sm text-black">{doc.name}</h3>
                <p className="text-xs text-[#2B231E] opacity-50 text-black">{doc.lastUpdated}</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={(agentData.selectedDocuments || []).includes(doc.id)}
                onChange={() => toggleDocument(doc.id)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-b from-[#8266D4] to-[#41288A]"></div>
            </label>
          </Card>
        ))}
      </div>

      <StepNavigation
        onPrevious={() =>
          router.push(`/dashboard/agent/create?type=${agentType}&step=1`)
        }
        onNext={() =>
          router.push(
            `/dashboard/agent/create?type=${agentType}&step=${nextStep}`
          )
        }
      />
    </div>
  );
}

function CreateAgentContent() {
  const searchParams = useSearchParams();
  const agentType = searchParams.get("type") || "inbound";
  const step = parseInt(searchParams.get("step") || "1");

  console.log("CreateAgentContent - agentType:", agentType, "step:", step); // Debug log

  const renderStep = () => {
    console.log("Rendering step:", step, "for agentType:", agentType); // Debug log

    if (agentType === "widget") {
      switch (step) {
        case 1:
          return <Step1 />;
        case 2:
          return <Step2 />;
        // case 3:
        //   return <Step3WidgetSettings />;
        case 3:
          return <Step5ReviewPublish />;
        default:
          console.log("Widget - defaulting to Step1, step was:", step);
          return <Step1 />;
      }
    } else if (agentType === "inbound") {
      // Inbound agent with phone number step
      switch (step) {
        case 1:
          return <Step1 />;
        case 2:
          return <Step2 />;
        case 3:
          return <Step3Channels />;
        case 4:
          return <Step4PhoneNumber />;
        case 5:
          return <Step5ReviewPublish />;
        default:
          console.log("Inbound - defaulting to Step1, step was:", step);
          return <Step1 />;
      }
    } else {
      // Outbound agent without phone number step
      switch (step) {
        case 1:
          return <Step1 />;
        case 2:
          return <Step2 />;
        case 3:
          return <Step3Channels />;
        case 4:
          return <Step5ReviewPublish />;
        default:
          console.log("Outbound - defaulting to Step1, step was:", step);
          return <Step1 />;
      }
    }
  };

  return (
    <AgentCreationLayout currentStep={step} agentType={agentType}>
      {renderStep()}
    </AgentCreationLayout>
  );
}

export default function CreateAgentPage() {
  return (
    <AgentCreationProvider>
      <Suspense fallback={<div className="flex items-center justify-center h-screen text-black">Loading...</div>}>
        <CreateAgentContent />
      </Suspense>
    </AgentCreationProvider>
  );
}
