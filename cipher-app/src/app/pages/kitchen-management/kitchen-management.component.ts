import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface InventoryItem {
  id: string;
  name: string;
  quantity: string;
  status: string;
}

interface Order {
  id: string;
  student: string;
  meal: string;
  time: string;
  status: string;
  progress: number;
}

interface MenuItem {
  day: string;
  meal: string;
  type: string;
  ingredients: string;
}

interface Feedback {
  student: string;
  meal: string;
  rating: number;
  comment: string;
  date: string;
}

@Component({
  selector: 'app-kitchen-management',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './kitchen-management.component.html',
  styleUrls: ['./kitchen-management.component.css']
})
export class KitchenManagementComponent {
  activeTab: string = 'inventory';
  isModalOpen: boolean = false;

  inventorySearchQuery: string = '';
  ordersSearchQuery: string = '';
  menuSearchQuery: string = '';
  feedbackSearchQuery: string = '';

  inventory: InventoryItem[] = [
    { id: 'ING001', name: 'Rice', quantity: '50 kg', status: 'Sufficient' },
    { id: 'ING002', name: 'Vegetables', quantity: '10 kg', status: 'Low' },
    { id: 'ING003', name: 'Chicken', quantity: '20 kg', status: 'Sufficient' }
  ];

  orders: Order[] = [
    { id: 'ORD001', student: 'John Doe', meal: 'Chicken Curry', time: '12:15 PM', status: 'Preparing', progress: 60 },
    { id: 'ORD002', student: 'Jane Smith', meal: 'Veggie Combo', time: '12:10 PM', status: 'Ordered', progress: 20 }
  ];

  menu: MenuItem[] = [
    { day: 'Monday', meal: 'Chicken Curry', type: 'Non-Veg', ingredients: 'Chicken, Spices, Rice' },
    { day: 'Tuesday', meal: 'Veggie Combo', type: 'Veg', ingredients: 'Vegetables, Rice, Dal' }
  ];

  feedback: Feedback[] = [
    { student: 'John Doe', meal: 'Chicken Curry', rating: 4.5, comment: 'Tasty but could use more spices.', date: 'Oct 2, 2025' },
    { student: 'Jane Smith', meal: 'Veggie Combo', rating: 5, comment: 'Really fresh and well-prepared!', date: 'Oct 1, 2025' }
  ];

  filteredInventory: InventoryItem[] = [...this.inventory];
  filteredOrders: Order[] = [...this.orders];
  filteredMenu: MenuItem[] = [...this.menu];
  filteredFeedback: Feedback[] = [...this.feedback];

  newItem: InventoryItem = { id: '', name: '', quantity: '', status: 'Sufficient' };

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  filterTable(tab: string): void {
    if (tab === 'inventory') {
      this.filteredInventory = this.inventory.filter(item =>
        Object.values(item).some(val => val.toLowerCase().includes(this.inventorySearchQuery.toLowerCase()))
      );
    } else if (tab === 'orders') {
      this.filteredOrders = this.orders.filter(order =>
        Object.values(order).some(val => val.toString().toLowerCase().includes(this.ordersSearchQuery.toLowerCase()))
      );
    } else if (tab === 'menu') {
      this.filteredMenu = this.menu.filter(menuItem =>
        Object.values(menuItem).some(val => val.toLowerCase().includes(this.menuSearchQuery.toLowerCase()))
      );
    } else if (tab === 'feedback') {
      this.filteredFeedback = this.feedback.filter(feedback =>
        Object.values(feedback).some(val => val.toString().toLowerCase().includes(this.feedbackSearchQuery.toLowerCase()))
      );
    }
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.newItem = { id: '', name: '', quantity: '', status: 'Sufficient' };
  }

  addInventoryItem(): void {
    if (this.newItem.id && this.newItem.name && this.newItem.quantity) {
      this.inventory.push({ ...this.newItem });
      this.filteredInventory = [...this.inventory];
      alert(`Added ${this.newItem.name} (${this.newItem.id}) with quantity ${this.newItem.quantity} and status ${this.newItem.status}.`);
      this.closeModal();
    } else {
      alert('Please fill in all fields.');
    }
  }
}