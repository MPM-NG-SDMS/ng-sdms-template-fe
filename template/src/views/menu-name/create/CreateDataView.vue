<script setup>
import { FormControl, FormField, FormItem, FormLabel, FormMessage, RequiredFormLabel } from '@/components/ui/form';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { getLocalTimeZone, today, DateFormatter } from '@internationalized/date';
import { cn } from '@/lib/utils';
import { PhCalendarDots, PhFloppyDisk, PhArrowLeft } from '@phosphor-icons/vue';
import { toDate } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import { ref } from 'vue'
import { useI18n } from 'vue-i18n';

const formSchema = toTypedSchema(z.object({
  nik: z.string({
    required_error: "NIK harus diisi",
  }).min(16, {
    message: "NIK harus diisi minimal 16 karakter"
  }).max(16, {
    message: "NIK harus diisi maksimal 16 karakter"
  }),
  noTelephone: z.string({
    required_error: "No Telephone harus diisi",
  }).min(10, {
    message: "No Telephone harus diisi minimal 10 karakter"
  }).max(13, {
    message: "No Telephone harus diisi maksimal 13 karakter"
  }),
  namaDepan: z.string({
    required_error: "Nama Depan harus diisi",
  }).min(3, {
    message: "Nama Depan harus diisi minimal 3 karakter"
  }).max(50, {
    message: "Nama Depan harus diisi maksimal 50 karakter"
  }),
  namaBelakang: z.string({
    required_error: "Nama Belakang harus diisi",
  }).min(3, {
    message: "Nama Belakang harus diisi minimal 3 karakter"
  }).max(50, {
    message: "Nama Belakang harus diisi maksimal 50 karakter"
  }),
  tanggalLahir: z.string({
    required_error: "Tanggal Lahir harus diisi",
  }),
  tempatLahir: z.string({
    required_error: "Tempat Lahir harus diisi",
  }),
  agama: z.string({
    required_error: "Agama harus diisi",
  }),
  jenisKelamin: z.string({
    required_error: "Jenis Kelamin harus diisi",
  }),
  pendidikan: z.string({
    required_error: "Pendidikan harus diisi",
  }),
  pekerjaan: z.string({
    required_error: "Pekerjaan harus diisi",
  }),
}))

const { t } = useI18n();
const form = useForm({
  schema: formSchema,
  keepValuesOnUnmount: true,
  initialValues: {
    nik: '',
    noTelephone: '',
    namaDepan: '',
    namaBelakang: '',
    tanggalLahir: '',
    tempatLahir: '',
    agama: '',
    jenisKelamin: '',
    pendidikan: '',
    pekerjaan: '',
  }
})

const df = new DateFormatter('id-ID', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  calendar: 'gregory',
})

const openItems = ref(['data-customer'])
</script>
<template>

  <Card>
    <CardContent>
      <Accordion type="multiple" v-model="openItems">
        <AccordionItem value="data-customer">
          <AccordionTrigger>{{ t('dataCustomer', 'Data Customer') }}</AccordionTrigger>
          <AccordionContent>
            <form class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              <!-- Row 1 -->
              <FormField name="nik" v-slot="{ componentField }">
                <FormItem>
                  <RequiredFormLabel>{{ t('form.nik', 'NIK') }}</RequiredFormLabel>
                  <Input v-bind="componentField" :placeholder="t('form.nik', 'NIK')" required />
                </FormItem>
              </FormField>
              <FormField name="noTelephone" v-slot="{ componentField }">
                <FormItem>
                  <RequiredFormLabel>{{ t('form.noTelephone', 'No Telephone') }}</RequiredFormLabel>
                  <Input v-bind="componentField" :placeholder="t('form.noTelephone', 'No Telephone')" required />
                </FormItem>
              </FormField>
              <!-- Row 2 -->
              <FormField name="namaDepan" v-slot="{ componentField }">
                <FormItem>
                  <RequiredFormLabel>{{ t('form.namaDepan', 'Nama Depan') }}</RequiredFormLabel>
                  <Input v-bind="componentField" :placeholder="t('form.namaDepan', 'Nama Depan')" required />
                </FormItem>
              </FormField>
              <FormField name="namaBelakang" v-slot="{ componentField }">
                <FormItem>
                  <RequiredFormLabel>{{ t('form.namaBelakang', 'Nama Belakang') }}</RequiredFormLabel>
                  <Input v-bind="componentField" :placeholder="t('form.namaBelakang', 'Nama Belakang')" required />
                </FormItem>
              </FormField>
              <!-- Row 3 -->
              <FormField name="tanggalLahir" v-slot="{ field }">
                <FormItem class="flex flex-col">
                  <FormLabel>{{ t('form.tanggalLahir', 'Tanggal Lahir') }}</FormLabel>
                  <div class="flex gap-2 w-full">
                    <Popover>
                      <PopoverTrigger as-child>
                        <FormControl class="flex-1">
                          <Button variant="outline" :class="cn(
                            'ps-3 text-start font-normal',
                            !field.value && 'text-muted-foreground',
                          )">
                            <span>
                              {{ field.value ? df.format(toDate(field.value.toDate(getLocalTimeZone()))) : t('form.tanggalLahir', 'Tanggal Lahir') }}
                            </span>
                            <PhCalendarDots class="ms-auto opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent class="w-auto p-0">
                        <Calendar v-model="field.value" calendar-label="Tanggal Lahir"
                          @update:model-value="(date) => {
                            field.onChange(date)
                            field.value = date
                          }" />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField name="tempatLahir" v-slot="{ componentField }">
                <FormItem>
                  <RequiredFormLabel>{{ t('form.tempatLahir', 'Tempat Lahir') }}</RequiredFormLabel>
                  <Input v-bind="componentField" :placeholder="t('form.tempatLahir', 'Tempat Lahir')" required />
                </FormItem>
              </FormField>
              <!-- Row 4 -->
              <FormField name="agama" v-slot="{ componentField }">
                <FormItem>
                  <RequiredFormLabel>{{ t('form.agama', 'Agama') }}</RequiredFormLabel>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full">
                      <SelectValue :placeholder="t('form.select', 'Select...')" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="islam">{{ t('form.islam', 'Islam') }}</SelectItem>
                      <SelectItem value="kristen">{{ t('form.kristen', 'Kristen') }}</SelectItem>
                      <SelectItem value="hindu">{{ t('form.hindu', 'Hindu') }}</SelectItem>
                      <SelectItem value="budha">{{ t('form.budha', 'Budha') }}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              </FormField>
              <!-- Row 5 -->
              <FormField name="jenisKelamin" v-slot="{ componentField }">
                <FormItem>
                  <RequiredFormLabel>{{ t('form.jenisKelamin', 'Jenis Kelamin') }}</RequiredFormLabel>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full">
                      <SelectValue :placeholder="t('form.select', 'Select...')" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="laki">{{ t('form.laki', 'Laki-laki') }}</SelectItem>
                      <SelectItem value="perempuan">{{ t('form.perempuan', 'Perempuan') }}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              </FormField>
              <FormField name="pendidikan" v-slot="{ componentField }">
                <FormItem>
                  <RequiredFormLabel>{{ t('form.pendidikan', 'Pendidikan') }}</RequiredFormLabel>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full">
                      <SelectValue :placeholder="t('form.select', 'Select...')" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sd">{{ t('form.sd', 'SD') }}</SelectItem>
                      <SelectItem value="smp">{{ t('form.smp', 'SMP') }}</SelectItem>
                      <SelectItem value="sma">{{ t('form.sma', 'SMA') }}</SelectItem>
                      <SelectItem value="s1">{{ t('form.s1', 'S1') }}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              </FormField>
              <!-- Row 6 -->
              <FormField name="pekerjaan" v-slot="{ componentField }">
                <FormItem>
                  <RequiredFormLabel>{{ t('form.pekerjaan', 'Pekerjaan') }}</RequiredFormLabel>
                  <Select v-bind="componentField">
                    <SelectTrigger class="w-full">
                    <SelectValue :placeholder="t('form.select', 'Select...')" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="swasta">{{ t('form.swasta', 'Swasta') }}</SelectItem>
                      <SelectItem value="pns">{{ t('form.pns', 'PNS') }}</SelectItem>
                      <SelectItem value="wirausaha">{{ t('form.wirausaha', 'Wirausaha') }}</SelectItem>
                    </SelectContent>
                </Select>
                </FormItem>
              </FormField>
            </form>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="informasi-kontak">
          <AccordionTrigger>{{ t('informasiKontak', 'Informasi Kontak') }}</AccordionTrigger>
          <AccordionContent>
            <!-- Add fields as needed -->
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="alamat">
          <AccordionTrigger>{{ t('alamat', 'Alamat') }}</AccordionTrigger>
          <AccordionContent>
            <!-- Add fields as needed -->
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="informasi-lainnya">
          <AccordionTrigger>{{ t('informasiLainnya', 'Informasi Lainnya') }}</AccordionTrigger>
          <AccordionContent>
            <!-- Add fields as needed -->
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div class="flex justify-end gap-2 mt-4">
        <Button variant="secondary" @click="$router.back()"> <PhArrowLeft /> {{ t('back', 'Kembali') }}</Button>
        <Button> <PhFloppyDisk /> {{ t('save', 'Simpan') }}</Button>
      </div>
    </CardContent>
  </Card>

</template>

<style scoped>
/* Add any custom styles if needed */
</style>