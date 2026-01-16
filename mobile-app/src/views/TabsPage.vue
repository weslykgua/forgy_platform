<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>

      <ion-tab-bar slot="bottom" class="custom-tab-bar">

        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon :icon="homeOutline" />
          <ion-label>Inicio</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab1" href="/tabs/tab1">
          <ion-icon :icon="barbellOutline" />
          <ion-label>Ejercicios</ion-label>
        </ion-tab-button>

        <!-- BOTÓN CENTRAL QR -->
        <div class="qr-button" @click="goToQR">
          <ion-icon :icon="cameraOutline"/>
        </div>

        <ion-tab-button tab="tab2" href="/tabs/tab2">
          <ion-icon :icon="calendarOutline" />
          <ion-label>Entreno</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab4" href="/tabs/tab4">
          <ion-icon :icon="personOutline" />
          <ion-label>Perfil</ion-label>
        </ion-tab-button>

      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue'
import { 
  homeOutline, 
  barbellOutline, 
  calendarOutline, 
  personOutline,
  cameraOutline
} from 'ionicons/icons'
import { useRouter } from 'vue-router'

const router = useRouter()
const goToQR = () => {
  router.push('/tabs/qr')
}
</script>

<style scoped>
.custom-tab-bar {
  --background: rgb(255, 255, 255);
  margin: 12px;
  border-radius: 30px;
  box-shadow: 0 8px 25px hsl(241, 99%, 28%);
  border: 1px solid #ffffff;
  padding: 14px 0 12px;
  position: relative;
  overflow: visible !important;
}

/* Hueco central (notch) */
.custom-tab-bar::before {
  content: '';
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 65px;
  background: rgb(255, 255, 255);
  border-radius: 0 0 45px 45px;
  box-shadow: 0 -6px 10px hsl(241, 99%, 28%);
  z-index: 1;
  pointer-events: none; /* <-- importante */
}

.qr-button {
  position: absolute;
  left: 50%;
  top: 10px; /* un poco más arriba */
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
  background: hsl(241, 99%, 28%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(255, 255, 255);
  border: 5px solid hsl(241, 99%, 28%);
  box-shadow:  25px hsl(241, 99%, 28%);
  z-index: 10;
}


.qr-button ion-icon {
  font-size: 28px;
}


ion-tab-button ion-label {
  font-size: 10px;
}
ion-tabs, 
ion-page, 
ion-router-outlet {
  overflow: visible !important;
}
ion-tab-button {
  padding-left: 10px;
  padding-right: 10px;
}

ion-tab-button:nth-child(2) {
  margin-right: 30px; /* Ejercicios se aleja del centro */
}

ion-tab-button:nth-child(4) {
  margin-left: 30px; /* Entreno se aleja del centro */
}

</style>
