import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-ai-agent',
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './ai-agent.component.html',
  styleUrls: ['./ai-agent.component.css'],
})
export class AiAgentComponent {
  messages: { text: string; user: boolean }[] = [];
  userInput: string = '';
  selectedFile: File | null = null;
  isChatOpen: boolean = true;

  @ViewChild('chatMessagesContainer') chatMessagesContainer!: ElementRef;

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('File selected:', file.name);
    }
  }

  removeSelectedFile() {
    this.selectedFile = null;
  }

  async sendMessage() {
    if (!this.userInput.trim()) return;

    this.messages.push({ text: this.userInput, user: true });

    const requestBody = {
      query: this.userInput,
      collections: ['master_profile', 'ews_profile', 'ews_feedback_profile'],
    };

    try {
      const response = await fetch(
        'https://docai-gze9ckcnapbyh8b2.canadacentral-01.azurewebsites.net/Triggerprofilebot',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      this.messages.push({
        text: this.formatBotMessage(data.reply),
        user: false,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      this.messages.push({
        text: 'Error fetching data. Please try again.',
        user: false,
      });
    }

    this.userInput = '';
    setTimeout(() => {
      this.chatMessagesContainer.nativeElement.scrollTop =
        this.chatMessagesContainer.nativeElement.scrollHeight;
    }, 100);
  }

  formatBotMessage(text: string): string {
    return text
      .replace(/###/g, '')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }
}
