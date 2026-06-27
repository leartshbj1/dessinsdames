import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp, arrayUnion, arrayRemove } from "firebase/firestore";
import { MessageSquare, Heart, Trash2, Send, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../lib/utils";

export default function Blog() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [expandedReplies, setExpandedReplies] = useState<string[]>([]);
  const [replyLoading, setReplyLoading] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "blogPosts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const p = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(p);
    });
    return () => unsubscribe();
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || !user) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "blogPosts"), {
        authorUid: user.uid,
        authorName: user.displayName || "Anonyme",
        authorPhotoUrl: user.photoURL || "",
        content: newPost.trim(),
        createdAt: serverTimestamp(),
        likes: [],
        replies: []
      });
      setNewPost("");
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (postId: string) => {
    if (!replyContent.trim() || !user) return;
    
    setReplyLoading(postId);
    try {
      const postRef = doc(db, "blogPosts", postId);
      await updateDoc(postRef, {
        replies: arrayUnion({
          id: crypto.randomUUID(),
          authorUid: user.uid,
          authorName: user.displayName || "Anonyme",
          authorPhotoUrl: user.photoURL || "",
          content: replyContent.trim(),
          createdAt: Date.now()
        })
      });
      setReplyContent("");
      setReplyingTo(null);
      if (!expandedReplies.includes(postId)) {
        setExpandedReplies(prev => [...prev, postId]);
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    } finally {
      setReplyLoading(null);
    }
  };

  const handleLike = async (postId: string, likes: string[]) => {
    if (!user) return;
    const postRef = doc(db, "blogPosts", postId);
    if (likes.includes(user.uid)) {
      await updateDoc(postRef, {
        likes: arrayRemove(user.uid)
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(user.uid)
      });
    }
  };

  const handleDelete = async (postId: string) => {
    if (!window.confirm("Supprimer ce post ?")) return;
    try {
      await deleteDoc(doc(db, "blogPosts", postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const toggleReplies = (postId: string) => {
    setExpandedReplies(prev => 
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-6 md:py-8 space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-serif italic font-bold tracking-tight uppercase">Le Journal</h1>
        <p className="text-xs font-bold uppercase tracking-widest opacity-60">Partagez vos inspirations, commentez et échangez autour de l'art.</p>
      </header>

      {/* Post Box */}
      <div className="bg-white border border-[#2D2D2D] p-6 shadow-[8px_8px_0px_#2D2D2D]">
        {user ? (
          <form onSubmit={handlePost} className="space-y-4">
            <div className="flex gap-4 items-start">
              <img src={user.photoURL || ""} alt={user.displayName || "User"} className="w-10 h-10 rounded-full border border-[#2D2D2D]" />
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Partagez vos croquis, une idée, une critique..."
                className="w-full bg-[#F7F4F0] border border-[#2D2D2D] px-4 py-3 text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#2D2D2D]/20 transition-all resize-none text-sm leading-relaxed"
                rows={3}
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !newPost.trim()}
                className="bg-[#2D2D2D] text-white border border-[#2D2D2D] px-6 py-2 font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-[#F7F4F0] hover:text-[#2D2D2D] transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Publier</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm font-bold uppercase tracking-widest opacity-60">Connectez-vous pour participer aux discussions</p>
          </div>
        )}
      </div>

      {/* Feed */}
      <div className="space-y-6">
        <AnimatePresence>
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#2D2D2D] p-6 flex gap-4"
            >
              <img src={post.authorPhotoUrl || ""} alt={post.authorName} className="w-10 h-10 rounded-full border border-[#2D2D2D] hidden md:block" />
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold font-serif">{post.authorName}</h4>
                    <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">
                      {post.createdAt?.toDate().toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {user && user.uid === post.authorUid && (
                    <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:opacity-70 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
                <div className="flex gap-6 pt-2">
                  <button
                    onClick={() => handleLike(post.id, post.likes || [])}
                    className={cn("flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors",
                      post.likes?.includes(user?.uid) ? "text-red-600" : "opacity-60 hover:opacity-100"
                    )}
                  >
                    <Heart className={cn("w-4 h-4", post.likes?.includes(user?.uid) && "fill-current")} />
                    <span>{post.likes?.length || 0}</span>
                  </button>
                  <button 
                    onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Répondre</span>
                  </button>
                </div>

                {/* Reply Input */}
                <AnimatePresence>
                  {replyingTo === post.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex gap-4 mt-4 items-start pt-4 border-t border-dashed border-[#2D2D2D]/30">
                        <img src={user?.photoURL || ""} alt={user?.displayName || "User"} className="w-8 h-8 rounded-full border border-[#2D2D2D] hidden sm:block" />
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Écrivez une réponse..."
                          className="w-full bg-[#F7F4F0] border border-[#2D2D2D] px-4 py-2 text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#2D2D2D]/20 transition-all resize-none text-xs leading-relaxed"
                          rows={2}
                          autoFocus
                        />
                        <button
                          onClick={() => handleReply(post.id)}
                          disabled={replyLoading === post.id || !replyContent.trim()}
                          className="bg-[#2D2D2D] text-white border border-[#2D2D2D] p-2 hover:bg-[#F7F4F0] hover:text-[#2D2D2D] transition-colors disabled:opacity-50 shrink-0"
                        >
                          {replyLoading === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Replies List */}
                {post.replies && post.replies.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#2D2D2D]/20">
                    <button 
                      onClick={() => toggleReplies(post.id)}
                      className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-colors w-full"
                    >
                      {expandedReplies.includes(post.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      <span>{expandedReplies.includes(post.id) ? "Masquer les réponses" : `Afficher les réponses (${post.replies.length})`}</span>
                    </button>
                    
                    <AnimatePresence>
                      {expandedReplies.includes(post.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-4 pt-4 ml-2 sm:ml-8 pl-4 border-l-2 border-[#2D2D2D]/10">
                            {post.replies.map((reply: any) => (
                              <div key={reply.id} className="flex gap-3">
                                <img src={reply.authorPhotoUrl || ""} alt={reply.authorName} className="w-6 h-6 rounded-full border border-[#2D2D2D] hidden sm:block mt-1" />
                                <div>
                                  <div className="flex items-baseline gap-2">
                                    <span className="font-bold font-serif text-sm">{reply.authorName}</span>
                                    <span className="text-[9px] uppercase font-bold tracking-widest opacity-40">
                                      {new Date(reply.createdAt).toLocaleDateString('fr-FR', {
                                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                      })}
                                    </span>
                                  </div>
                                  <p className="text-xs leading-relaxed mt-1 whitespace-pre-wrap">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
