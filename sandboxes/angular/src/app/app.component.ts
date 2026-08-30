import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface CadastroForm {
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  cep: string;
  uf: string;
  nascimento: string;
  tipoConta: string;
  mensagem: string;
  novidades: boolean;
  aceitaTermos: boolean;
}

function emptyForm(): CadastroForm {
  return {
    nome: '',
    email: '',
    telefone: '',
    documento: '',
    cep: '',
    uf: '',
    nascimento: '',
    tipoConta: 'pessoal',
    mensagem: '',
    novidades: false,
    aceitaTermos: false,
  };
}

// scarlet-select needs its options as a real array, not a string attribute
// — Angular's [options] property binding (allowed on any tag once
// CUSTOM_ELEMENTS_SCHEMA is declared, see the component decorator below)
// assigns it directly as a DOM property, same mechanism as [value] below.
// Doesn't need to be a signal: it's a static list, never reassigned.
const UF_OPTIONS = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  // Required so Angular's template compiler accepts <scarlet-*> tags as
  // native custom elements (Stencil web components) instead of raising
  // "is not a known element" errors.
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'scarlet-angular-sandbox';

  inputValue = signal('');
  lastClicked = signal('-');
  clickCount = signal(0);
  alertVisible = signal(true);

  ufOptions = UF_OPTIONS;
  form = signal<CadastroForm>(emptyForm());
  submitted = signal(false);

  // computed() re-derives from form() automatically — no manual dependency
  // tracking, unlike the getter this replaced.
  canSubmit = computed(() => {
    const current = this.form();
    return current.nome.trim() !== '' && current.email.trim() !== '' && current.aceitaTermos;
  });

  onButtonClick(name: string): void {
    this.lastClicked.set(name);
    this.clickCount.update((count) => count + 1);
  }

  onInputChange(event: Event): void {
    const customEvent = event as CustomEvent<string>;
    this.inputValue.set(customEvent.detail);
  }

  onAlertDismiss(): void {
    this.alertVisible.set(false);
  }

  // Shared by every field in the cadastro form: `event.detail` is the
  // masked/typed string for text-like fields, or the boolean/string value
  // Stencil already computed for select/switch/checkbox/radio-group.
  setField<K extends keyof CadastroForm>(field: K, event: Event): void {
    const detail = (event as CustomEvent<CadastroForm[K]>).detail;
    this.form.update((current) => ({ ...current, [field]: detail }));
  }

  submitForm(): void {
    this.submitted.set(true);
  }

  resetForm(): void {
    this.form.set(emptyForm());
    this.submitted.set(false);
  }
}
