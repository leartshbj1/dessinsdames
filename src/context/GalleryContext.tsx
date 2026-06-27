import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Drawing } from "../types";
import { db } from "../lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "./AuthContext";

interface GalleryContextType {
  drawings: Drawing[];
  addDrawing: (drawing: Omit<Drawing, "id" | "createdAt">) => Promise<void>;
  deleteDrawing: (id: string) => Promise<void>;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, "drawings"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const p = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          imageUrl: data.imageUrl,
          startDate: data.startDate,
          endDate: data.endDate,
          createdAt: data.createdAt?.toMillis() || Date.now(),
          authorUid: data.authorUid,
        } as Drawing;
      });
      setDrawings(p);
    });
    return () => unsubscribe();
  }, []);

  const addDrawing = async (drawingData: Omit<Drawing, "id" | "createdAt">) => {
    if (!user) throw new Error("User must be authenticated to add drawing");
    await addDoc(collection(db, "drawings"), {
      ...drawingData,
      createdAt: serverTimestamp(),
      authorUid: user.uid,
    });
  };

  const deleteDrawing = async (id: string) => {
    await deleteDoc(doc(db, "drawings", id));
  };

  return (
    <GalleryContext.Provider value={{ drawings, addDrawing, deleteDrawing }}>
      {children}
    </GalleryContext.Provider>
  );
}

export function useGallery() {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error("useGallery must be used within a GalleryProvider");
  }
  return context;
}
