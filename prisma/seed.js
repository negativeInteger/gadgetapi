import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { generateCodename } from "../api/utils/codename.js";

const dummyGadgets = [
    { name: "Smartphone X", codename: generateCodename(), description: "A powerful flagship smartphone" },
    { name: "AI Assistant", codename: generateCodename() },
    { name: "Wireless Earbuds", codename: generateCodename(), description: "Noise-canceling, high-quality audio" },
    { name: "Smartwatch Pro", codename: generateCodename() },
    { name: "Futuristic Tablet", codename: generateCodename(), description: "Ultra-thin, high-performance tablet" },
    { name: "VR Headset", codename: generateCodename() },
    { name: "Gaming Console", codename: generateCodename(), description: "Next-gen gaming experience" },
    { name: "Self-driving Drone", codename: generateCodename() },
    { name: "Home Assistant", codename: generateCodename(), description: "Voice-controlled smart home hub" },
    { name: "Holographic Display", codename: generateCodename() },
    { name: "AI-powered Speaker", codename: generateCodename(), description: "Smart speaker with AI capabilities" },
    { name: "Electric Skateboard", codename: generateCodename() },
    { name: "Augmented Reality Glasses", codename: generateCodename(), description: "See the world differently" },
    { name: "Portable Projector", codename: generateCodename() },
    { name: "Smart Door Lock", codename: generateCodename(), description: "Advanced security with fingerprint recognition" },
    { name: "E-ink Notebook", codename: generateCodename() },
    { name: "Solar-powered Charger", codename: generateCodename(), description: "Eco-friendly, portable power" },
    { name: "Smart Ring", codename: generateCodename() },
    { name: "Wireless Charging Pad", codename: generateCodename(), description: "Fast and convenient charging" },
    { name: "AI-Powered Translator", codename: generateCodename() },
    { name: "Smart Thermostat", codename: generateCodename(), description: "Efficient energy-saving climate control" },
    { name: "Digital Drawing Tablet", codename: generateCodename() },
    { name: "Wearable Health Monitor", codename: generateCodename(), description: "Tracks vital signs in real-time" },
    { name: "Portable Air Purifier", codename: generateCodename() },
    { name: "AI-Powered Camera", codename: generateCodename(), description: "Smart photography assistant" },
    { name: "Foldable Laptop", codename: generateCodename() },
    { name: "Smart Bicycle", codename: generateCodename(), description: "GPS-enabled with auto-assist mode" },
    { name: "Self-cleaning Water Bottle", codename: generateCodename() },
    { name: "AI Chatbot Device", codename: generateCodename(), description: "Personal AI companion" },
    { name: "Smart Backpack", codename: generateCodename(), description: "Solar-powered with USB charging ports" }
];

(async () => {
    try {
        await prisma.$connect();
        console.log("Database Connected");
        await prisma.gadget.createMany({
            data: dummyGadgets,
            skipDuplicates: true
        });
        console.log("Dummy data inserted successfully!");
    } catch (err) {
        console.error("Database Connection Failed:", err);
        process.exit(1); // Stop the app if DB is not connected
    }
})();
