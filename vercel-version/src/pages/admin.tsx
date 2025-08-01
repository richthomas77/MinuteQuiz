import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Upload, Settings, FileText, Edit, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Resource, insertResourceSchema } from "@shared/schema";
import { z } from "zod";

const uploadFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export default function Admin() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
  });

  const form = useForm<z.infer<typeof uploadFormSchema>>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const createResourceMutation = useMutation({
    mutationFn: async (data: z.infer<typeof insertResourceSchema>) => {
      await apiRequest("POST", "/api/resources", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
      toast({
        title: "Success",
        description: "Resource created successfully",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create resource",
        variant: "destructive",
      });
    },
  });

  const uploadQuizMutation = useMutation({
    mutationFn: async ({ resourceId, formData }: { resourceId: string; formData: FormData }) => {
      const response = await fetch(`/api/resources/${resourceId}/quizzes`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Upload failed");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
      toast({
        title: "Success",
        description: "Quiz uploaded and processed successfully",
      });
      setSelectedFile(null);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to upload quiz document",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const onSubmit = (data: z.infer<typeof uploadFormSchema>) => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!resources || resources.length === 0) {
      // Create resource first, then upload quiz
      createResourceMutation.mutate({
        title: data.title,
        description: data.description,
      });
    } else {
      // Upload quiz to existing resource
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("document", selectedFile);

      uploadQuizMutation.mutate({
        resourceId: resources[0].id, // For now, add to first resource
        formData,
      });
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading admin panel...</div>;
  }

  return (
    <section className="py-16 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-neutral-900 mb-4">Admin Dashboard</h2>
          <p className="text-xl text-neutral-700">Manage resources and upload new quiz content</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload New Quiz */}
          <Card className="bg-neutral-50">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center">
                <Upload className="mr-3 text-primary" size={32} />
                Upload New Quiz
              </h3>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quiz Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., The First Minute - Chapter 2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description of the quiz content" 
                            className="h-24"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <Label>Quiz Document</Label>
                    <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer mt-2">
                      <input
                        type="file"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <FileText size={64} className="mx-auto mb-4 text-neutral-400" />
                        <h4 className="text-lg font-semibold text-neutral-700 mb-2">
                          {selectedFile ? selectedFile.name : "Drop your file here or click to browse"}
                        </h4>
                        <p className="text-neutral-500">Supports PDF, DOCX, and TXT files</p>
                      </label>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={createResourceMutation.isPending || uploadQuizMutation.isPending}
                  >
                    <Upload className="mr-2" size={20} />
                    {createResourceMutation.isPending || uploadQuizMutation.isPending ? "Processing..." : "Add Quiz"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Resource Management */}
          <Card className="bg-neutral-50">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center">
                <Settings className="mr-3 text-primary" size={32} />
                Manage Resources
              </h3>
              
              <div className="space-y-4 mb-8">
                {resources?.map((resource) => (
                  <Card key={resource.id} className="border border-neutral-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-neutral-900">{resource.title}</h4>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit size={16} />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-500 hover:bg-red-50">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-neutral-600">Quizzes:</span>
                          <span className="font-medium ml-1">{resource.totalQuizzes}</span>
                        </div>
                        <div>
                          <span className="text-neutral-600">Created:</span>
                          <span className="font-medium ml-1">
                            {new Date(resource.createdAt!).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {!resources || resources.length === 0 && (
                  <div className="text-center py-8 text-neutral-500">
                    No resources available. Upload your first quiz to get started.
                  </div>
                )}
              </div>
              
              {/* File Format Guide */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-neutral-900 mb-3 flex items-center">
                    <Info className="mr-2 text-primary" size={20} />
                    Supported File Formats
                  </h4>
                  <ul className="space-y-2 text-sm text-neutral-700">
                    <li className="flex items-center">
                      <FileText className="mr-2 text-red-500" size={16} />
                      <strong>PDF:</strong> Extract text and parse structured questions
                    </li>
                    <li className="flex items-center">
                      <FileText className="mr-2 text-blue-500" size={16} />
                      <strong>DOCX:</strong> Microsoft Word documents with formatted quiz content
                    </li>
                    <li className="flex items-center">
                      <FileText className="mr-2 text-neutral-500" size={16} />
                      <strong>TXT:</strong> Plain text files with structured question format
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
