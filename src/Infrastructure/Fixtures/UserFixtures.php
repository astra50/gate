<?php

declare(strict_types=1);

namespace App\Infrastructure\Fixtures;

use App\Domain\User\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

final class UserFixtures extends Fixture
{
    public const USERNAME = 'test@astra50.ru';

    /**
     * {@inheritdoc}
     */
    public function load(ObjectManager $manager): void
    {
        $user = new User(self::USERNAME, []);

        $manager->persist($user);
        $manager->flush();
    }
}
